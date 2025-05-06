package com.accounts;

import com.auth.AuthResource;
import com.auth.JwtService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ibm.websphere.security.jwt.InvalidConsumerException;
import com.ibm.websphere.security.jwt.InvalidTokenException;
import com.ibm.websphere.security.jwt.JwtConsumer;
import com.ibm.websphere.security.jwt.JwtToken;
import com.mongodb.MongoClientSettings;
import com.mongodb.client.*;
import com.mongodb.client.model.Filters;
import com.mongodb.client.model.Projections;
import com.mongodb.client.result.DeleteResult;
import com.mongodb.client.result.UpdateResult;
import com.sharedQuotes.SharedQuote;

import jakarta.annotation.PostConstruct;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.enterprise.context.RequestScoped;
import jakarta.inject.Inject;
import jakarta.json.Json;
import jakarta.json.JsonArrayBuilder;
import jakarta.json.JsonObject;
import jakarta.json.JsonWriter;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.ws.rs.core.HttpHeaders;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.NewCookie;

import org.bson.Document;
import org.bson.conversions.Bson;
import org.bson.types.ObjectId;

import jakarta.ws.rs.core.Response;

import java.io.StringReader;
import java.io.StringWriter;
import java.net.URI;
import java.util.*;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

import com.moderation.ProfanityClass;
import static com.mongodb.client.model.Filters.eq;

@RequestScoped
public class AccountService {

    @Inject
    private MongoClient client;

    private MongoDatabase accountDB;
    private MongoCollection<Document> accountCollection;

    private ProfanityClass profanityFilter = new ProfanityClass();

    public AccountService() {}

    @PostConstruct
    public void init() {
        accountDB = client.getDatabase("Accounts");
        accountCollection = accountDB.getCollection("Users");
    }

    public AccountService(MongoClient mongoClient, String dbName, String collectionName) {
        client = mongoClient;
        accountDB = client.getDatabase(dbName);
        accountCollection = accountDB.getCollection(collectionName);
    }

    public MongoCollection<Document> getAccountCollection() {
        return accountCollection;
    }

    public Response newUser(String accountJson) {
        Document accountDocument;
        try {
            accountDocument = Document.parse(accountJson);
        } catch (Exception e) {
            return Response
                    .status(Response.Status.BAD_REQUEST)
                    .entity(new Document("error", "Cannot parse JSON object!").toJson())
                    .build();
        }

        if (!accountDocument.containsKey("Email") || accountDocument.getString("Email") == null || Objects.equals(accountDocument.getString("Email"), "")) {
            return Response
                    .status(Response.Status.BAD_REQUEST)
                    .entity(new Document("error", "Missing required field: email").toJson())
                    .build();
        }

         if (profanityFilter.checkProfanity(accountDocument.getString("Profession"))) {
            return Response.status(Response.Status.BAD_REQUEST).entity(new Document("error", "Profession is not appropiate.").toJson()).build();
        }

        if (profanityFilter.checkProfanity(accountDocument.getString("PersonalQuote"))) {
            return Response.status(Response.Status.BAD_REQUEST).entity(new Document("error", "Personal Quote is not appropiate.").toJson()).build();
        }

        FindIterable<Document> result = accountCollection.find(eq("email", accountDocument.getString("email")));

        if (result != null && result.first() != null) {
            return Response
                    .status(Response.Status.CONFLICT)
                    .entity(new Document("error", "Email already exists!").toJson())
                    .build();
        }

        accountCollection.insertOne(accountDocument);

        return Response
                .status(Response.Status.OK)
                .entity(accountDocument.toJson())
                .build();
    }

    public Response newUserWithCookie(Account account) {
        Document accountDocument = Document.parse(account.toJson());
        Document oldAccountDocument = accountCollection.find(eq("Email", accountDocument.getString("Email"))).first();

        String id;

        if (oldAccountDocument != null) {
            Document updateFields = new Document();
            updateFields.append("access_token", account.access_token);
            updateFields.append("expires_at", account.expires_at);
            updateFields.append("scope", account.scope);
            updateFields.append("token_type", account.token_type);

            id = oldAccountDocument.getObjectId("_id").toString();
            accountCollection.updateOne(oldAccountDocument,
                    new Document("$set", updateFields));
        } else {
            id = accountCollection.insertOne(accountDocument).getInsertedId().asObjectId().getValue().toString();
        }

        String jwt = JwtService.buildJwt(id).toString();
        String userServiceUrl = System.getenv("USER_SERVICE_URL");

        return Response
                .status(Response.Status.FOUND)
                .location(URI.create(userServiceUrl + "/users/auth/checkJWT/" + jwt))
                .build();
    }

    public Response retrieveUser(String accountID, Boolean includeOauth) {
        ArrayList<String> fieldsList = new ArrayList<String>(
                List.of("Email", "Username", "admin", "Notifications", "MyQuotes",
                        "BookmarkedQuotes", "SharedQuotes", "MyTags", "Profession", "PersonalQuote","UsedQuotes"));

        if (includeOauth) {
            List<String> oauthList = List.of("access_token", "refresh_token", "expires_at", "scope",
                    "token_type");
            fieldsList.addAll(oauthList);
        }

        ObjectId objectId;

        try {
            objectId = new ObjectId(accountID);
        } catch (Exception e) {
            return Response
                    .status(Response.Status.NOT_FOUND)
                    .entity(new Document("error", "Invalid object id!").toJson())
                    .build();
        }

        Bson projectionFields = Projections.fields(
                Projections.include(fieldsList));
        Document doc = accountCollection.find(eq("_id", objectId))
                .projection(projectionFields)
                .first();

        if (doc == null) {
            return Response
                    .status(Response.Status.NOT_FOUND)
                    .entity(new Document("error", "Account not found!").toJson())
                    .build();
        }

        return Response
                .ok(doc.toJson())
                .type(MediaType.APPLICATION_JSON)
                .build();
    }

    public Response retrieveUserByEmail(String email, boolean includePrivateData) {
        try {
            System.out.println("email: " + email);
            if (email == null) {
                System.out.println("email is null");
                return Response.status(Response.Status.NOT_FOUND)
                        .entity(new Document("error", "Email is null!").toJson())
                        .build();
            }

            Document user = accountCollection.find(eq("Email", email)).first();

            if (user == null) {
                return Response.status(Response.Status.NOT_FOUND)
                        .entity(new Document("error", "User with email " + email + " not found").toJson())
                        .build();
            }

            if (!includePrivateData) {
                user.remove("access_token");
                user.remove("refresh_token");
                user.remove("expires_at");
                user.remove("scope");
                user.remove("token_type");
            }

            return Response.status(Response.Status.OK).entity(user.toJson()).build();
        } catch (Exception e) {
            System.out.println("Error: " + e.getMessage());
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity(new Document("error", "Error retrieving user: " + e.getMessage()).toJson())
                    .build();
        }
    }

    public Response retrieveUsersQuery(String query) {
        try {
            if (query == null || query.trim().isEmpty()) {
                AggregateIterable<Document> results = accountCollection.aggregate(Arrays.asList(
                        new Document("$sample", new Document("size", 50)),
                        new Document("$project", new Document("Email", 1).append("Username", 1))
                ));

                JsonArrayBuilder jsonArrayBuilder = Json.createArrayBuilder();
                for (Document doc : results) {
                    JsonObject jsonObject = Json.createReader(new StringReader(doc.toJson())).readObject();
                    jsonArrayBuilder.add(jsonObject);
                }

                StringWriter stringWriter = new StringWriter();
                try (JsonWriter jsonWriter = Json.createWriter(stringWriter)) {
                    jsonWriter.writeArray(jsonArrayBuilder.build());
                }

                return Response.ok(stringWriter.toString()).build();
            }

            List<Document> MustClause;
            if (query.length() >= 6) {
                MustClause = List.of( //search that "must" occur
                        new Document("text", new Document("query", query) //set query string to user query
                                .append("path", Arrays.asList("Email", "Username")) // fields to search and compare to
                                .append("fuzzy", new Document("maxEdits", 2)))
                );
            } else if (query.length() >= 3) {
                MustClause = List.of( //search that "must" occur
                        new Document("text", new Document("query", query) //set query string to user query
                                .append("path", Arrays.asList("Email", "Username")) // fields to search and compare to
                                .append("fuzzy", new Document("maxEdits", 1)))
                );
            } else {
                MustClause = List.of( //search that "must" occur
                        new Document("autocomplete", new Document("query", query) //set query string to user query
                                .append("path", Arrays.asList("Email", "Username")) // fields to search and compare to
                ));
            }

            //build search query document
            Document CompoundDoc = new Document("must", MustClause); //default searching

            // create query document
            AggregateIterable<Document> results = accountCollection.aggregate(Arrays.asList(
                    new Document("$search", new Document("index", "UsersAtlasSearch") //set to search atlas index
                            .append("compound", CompoundDoc)),
                    //post search section
                    new Document("$sort", new Document("score", -1)), //sort by relevance
                    new Document("$limit", 50),
                    new Document("$project", new Document("Email", 1).append("Username", 1)))); //limit to 50 results

            JsonArrayBuilder jsonArrayBuilder = Json.createArrayBuilder();

            for(Document doc : results) {
                JsonObject jsonObject = Json.createReader(new StringReader(doc.toJson())).readObject();
                jsonArrayBuilder.add(jsonObject);
            }

            StringWriter stringWriter = new StringWriter();
            try(JsonWriter jsonWriter = Json.createWriter(stringWriter)) {
                jsonWriter.writeArray(jsonArrayBuilder.build());
            }

            return Response.ok(stringWriter.toString()).build();

        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity(new Document("error", "Error retrieving user: " + e.getMessage()).toJson())
                    .build();
        }
    }

    public Document retrieveUserFromJWT(String jwtString) {
        try {
            JwtConsumer consumer = JwtConsumer.create("defaultJwtConsumer");
            JwtToken jwt = consumer.createJwt(jwtString);

            String id = jwt.getClaims().getSubject();

            ObjectId objectId;
            try {
                objectId = new ObjectId(id);
            } catch (Exception e) {
                return null;
            }

            return accountCollection.find(eq("_id", objectId)).first();
        } catch (InvalidConsumerException | InvalidTokenException e) {
            System.out.println(e);
            return null;
        }
    }

    public Response deleteUser(String accountID) {
        ObjectId objectId;

        try {
            objectId = new ObjectId(accountID);
        } catch (Exception e) {
            return Response
                    .status(Response.Status.NOT_FOUND)
                    .entity(new Document("error", "Invalid object id!").toJson())
                    .build();
        }

        MongoCollection<Document> users = accountDB.getCollection("Users");
        Bson query = eq("_id", objectId);
        DeleteResult result = users.deleteOne(query);

        if (result.getDeletedCount() == 1) {
            return Response
                    .status(Response.Status.OK)
                    .build();
        } else {
            return Response
                    .status(Response.Status.NOT_FOUND)
                    .entity(new Document("error", "Account not found!").toJson())
                    .build();
        }
    }

    public Response deleteUserByEmail(String email) {
        MongoCollection<Document> users = accountDB.getCollection("Users");
        Bson query = eq("Email", email);
        users.deleteOne(query);

        return Response
                .status(Response.Status.OK)
                .build();
    }

    public Response updateUser(String updatedAccountJson, String id) {
        ObjectId objectId;

        try {
            objectId = new ObjectId(id);
        } catch (Exception e) {
            return Response
                    .status(Response.Status.NOT_FOUND)
                    .entity(new Document("error", "Invalid object id!").toJson())
                    .build();
        }

        Document updatedAccountDocument;
        try {
            updatedAccountDocument = Document.parse(updatedAccountJson);
        } catch (Exception e) {
            return Response
                    .status(Response.Status.BAD_REQUEST)
                    .entity(new Document("error", "Cannot parse Json!").toJson())
                    .build();
        }

        if (updatedAccountDocument.getString("Profession") != null && profanityFilter.checkProfanity(updatedAccountDocument.getString("Profession"))) {
            return Response.status(Response.Status.BAD_REQUEST).entity(new Document("error", "Profession is not appropiate.").toJson()).build();
        }

        if (updatedAccountDocument.getString("PersonalQuote") != null && profanityFilter.checkProfanity(updatedAccountDocument.getString("PersonalQuote"))) {
            return Response.status(Response.Status.BAD_REQUEST).entity(new Document("error", "Personal Quote is not appropiate.").toJson()).build();
        }

        UpdateResult updateResult = accountCollection.updateOne(
                eq("_id", objectId),
                new Document("$set", updatedAccountDocument)
        );

        if (updateResult.getModifiedCount() == 1) {
            try {
                ArrayList<String> fieldsList = new ArrayList<String>(
                        List.of("Email", "Username", "admin", "Notifications", "MyQuotes",
                                "BookmarkedQuotes", "SharedQuotes", "MyTags", "Profession", "PersonalQuote","UsedQuotes"));

                Bson projectionFields = Projections.fields(
                        Projections.include(fieldsList));

                return Response
                        .status(Response.Status.OK)
                        .entity(accountCollection.find(eq("_id", objectId)).projection(projectionFields).first().toJson())
                        .build();
            } catch (NullPointerException e) {
                return Response
                        .status(Response.Status.NOT_FOUND)
                        .entity(new Document("error", "Account Not found!").toJson())
                        .build();
            }
        } else {
            return Response
                    .status(Response.Status.NOT_FOUND)
                    .entity(new Document("error", "Account Not found!").toJson())
                    .build();
        }
    }

   
    public Account document_to_account(Document document) {
        String email = document.getString("Email");
        String username = document.getString("Username");
        int admin = document.getInteger("admin", 0);
        String accessToken = document.getString("access_token");
        String refreshToken = document.getString("refresh_token");
        Long expiresAt = document.getLong("expires_at");
        List<String> scope = document.getList("scope", String.class);
        String tokenType = document.getString("token_type");
        List<String> notifications = document.getList("Notifications", String.class);
        List<String> myQuotes = document.getList("MyQuotes", String.class);
        List<String> bookmarkedQuotes = document.getList("BookmarkedQuotes", String.class);
        List<Document> sharedQuotesDocs = document.getList("SharedQuotes", Document.class);
        List<SharedQuote> sharedQuotes = new ArrayList<>();
        for (Document sharedDoc : sharedQuotesDocs) {
            SharedQuote sharedQuote = new SharedQuote();
            sharedQuote.setTo(sharedDoc.getString("to"));
            sharedQuote.setFrom(sharedDoc.getString("from"));
            sharedQuote.setQuoteId(sharedDoc.getString("quoteId"));
            sharedQuotes.add(sharedQuote);
        }
        String profession = document.getString("Profession");
        String personalQuote = document.getString("PersonalQuote");
        Map<String, String> usedQuotes = (Map<String, String>) document.get("UsedQuotes");


        Account account = new Account(email, username, admin, accessToken, refreshToken, expiresAt, scope, tokenType,
                notifications, myQuotes, bookmarkedQuotes, sharedQuotes, profession, personalQuote, usedQuotes);

        return account;
    }

    public Document account_to_document(Account account) {
        Document document = new Document("Email", account.Email)
                .append("Username", account.Username)
                .append("admin", account.admin)
                .append("access_token", account.access_token)
                .append("refresh_token", account.refresh_token)
                .append("expires_at", account.expires_at)
                .append("scope", account.scope)
                .append("token_type", account.token_type)
                .append("Notifications", account.Notifications)
                .append("MyQuotes", account.MyQuotes)
                .append("BookmarkedQuotes", account.BookmarkedQuotes)
                .append("SharedQuotes", account.SharedQuotes.stream()
                        .map(sq -> new Document("to", sq.getTo())
                                .append("from", sq.getFrom())
                                .append("quoteId", sq.getQuoteId()))
                        .collect(Collectors.toList()))
                .append("Profession", account.Profession)
                .append("PersonalQuote", account.PersonalQuote)
                .append("UsedQuotes", account.UsedQuotes);

        return document;
    }

    public String getAccountIdByEmail(String email) {
        Document doc = accountCollection.find(eq("Email", email))
                .projection(Projections.include("_id"))
                .first();

        if (doc == null) {
            return null;
        }

        return doc.getObjectId("_id").toHexString();
    }
}
