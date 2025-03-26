package com.quotes;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.inject.Inject;
import jakarta.json.Json;
import jakarta.json.JsonObject;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.HttpHeaders;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.*;
import org.bson.Document;
import org.bson.types.ObjectId;
import org.eclipse.microprofile.openapi.annotations.Operation;
import org.eclipse.microprofile.openapi.annotations.enums.SchemaType;
import org.eclipse.microprofile.openapi.annotations.media.Schema;
import org.eclipse.microprofile.openapi.annotations.parameters.Parameter;
import org.eclipse.microprofile.openapi.annotations.responses.APIResponse;
import org.eclipse.microprofile.openapi.annotations.responses.APIResponses;

import java.io.IOException;
import java.util.Map;


@Path("/delete")
public class QuoteDeleteResource {

    @Inject
    MongoUtil mongo;

    @DELETE
    @Path("/{quoteId}")
    @Consumes(MediaType.APPLICATION_JSON)
    @APIResponses(value = {
            @APIResponse(responseCode = "200", description = "Quote was successfully deleted"),
            @APIResponse(responseCode = "404", description = "Quote ID was not found in the database"),
            @APIResponse(responseCode = "400", description = "Given ID is not a valid ObjectId"),
            @APIResponse(responseCode = "409", description = "IllegalArgumentException occurred during operation")
    })
    @Operation(summary = "deletes a quote from the database")
    public Response deleteQuote(@Parameter(
            description = "ObjectId of quote you want to delete",
            required = true,
            example = "67b61f18daa68e25fbd151e9",
            schema = @Schema(type = SchemaType.STRING)
    )@PathParam("quoteId") String quoteID, @Context HttpHeaders headers) {
        try{
            String authHeader = headers.getHeaderString(HttpHeaders.AUTHORIZATION);

            if (authHeader == null || !authHeader.toLowerCase().startsWith("bearer ")) {
                return Response.status(Response.Status.UNAUTHORIZED)
                        .entity(new Document("error", "Missing or invalid Authorization header").toJson())
                        .build();
            }

            String jwtString = authHeader.replaceFirst("(?i)^Bearer\\s+", "");

            Map<String, String> jwtMap= QuotesRetrieveAccount.retrieveJWTData(jwtString);

            if (jwtMap == null) {
                return Response.status(Response.Status.UNAUTHORIZED).entity(new Document("error", "User not authorized to delete quotes").toJson()).build();
            }

            // get account ID from JWT
            String accountID = jwtMap.get("subject");

            // get group from JWT
            String group = jwtMap.get("group");

            // check if account has not been logged in
            if (accountID == null || group == null) {
                return Response.status(Response.Status.UNAUTHORIZED).entity(new Document("error", "User not authorized to delete quotes").toJson()).build();
            }

            ObjectId objectId = new ObjectId(quoteID);
            String jsonQuote = mongo.getQuote(objectId);
            QuoteObject quote;
            try {
                ObjectMapper objectMapper = new ObjectMapper();
                quote = objectMapper.readValue(jsonQuote, QuoteObject.class);
            } catch (IOException e) {
                return Response.status(Response.Status.BAD_REQUEST).entity("IOException: "+e).build();
            }

            ObjectId accountObjectID = new ObjectId(accountID);

            // user is not owner of quote
            if (!accountObjectID.equals(quote.getCreator()) && !group.equals("admin")) {
                return Response.status(Response.Status.UNAUTHORIZED).entity(new Document("error", "User not authorized to delete quotes").toJson()).build();
            }

            //check id is in valid form
            if(!SanitizerClass.validObjectId(quoteID)) {
                return Response.status(Response.Status.BAD_REQUEST).entity("Given ID is not valid ObjectId").build();
            }

            boolean result = mongo.deleteQuote(objectId);
            if(result) {
                JsonObject jsonResponse = Json.createObjectBuilder()
                        .add("Response", "200")
                        .build();
                return Response.ok(jsonResponse).build();
            } else {
                return Response.status(Response.Status.NOT_FOUND).entity("Quote not found, could not be deleted").build();
            }
        } catch (IllegalArgumentException e) {
            return Response.status(Response.Status.CONFLICT).entity("IllegalArgumentException: "+e).build();
        }
    }
}
