package com.accounts;

import jakarta.annotation.security.RolesAllowed;
import jakarta.json.Json;
import jakarta.json.JsonObjectBuilder;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.SecurityContext;
import jakarta.ws.rs.core.Response.Status;

import org.eclipse.microprofile.openapi.annotations.Operation;
import org.eclipse.microprofile.openapi.annotations.media.Content;
import org.eclipse.microprofile.openapi.annotations.media.ExampleObject;
import org.eclipse.microprofile.openapi.annotations.parameters.RequestBody;
import org.eclipse.microprofile.openapi.annotations.responses.APIResponse;
import org.eclipse.microprofile.openapi.annotations.responses.APIResponses;

import com.ibm.websphere.security.jwt.InvalidConsumerException;
import com.ibm.websphere.security.jwt.InvalidTokenException;
import com.ibm.websphere.security.jwt.JwtConsumer;
import com.ibm.websphere.security.jwt.JwtToken;

import java.security.Principal;

@Path("/accounts")
public class AccountsResource {

    public static AccountService accountService = new AccountService();

    @POST
    @Path("/create")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @APIResponses(value = {
            @APIResponse(responseCode = "200", description = "User Successfully created and added to the database. Will return new account document.", content = @Content(mediaType = "application/json")),
            @APIResponse(responseCode = "400", description = "Invalid JSON format"),
            @APIResponse(responseCode = "409", description = "Account with the same email already exists"),
    })
    @Operation(summary = "Creates a new user account. Ensure the request header is `application/json` and provide a JSON body in the specified format.")
    @RequestBody(description = "Example request body endpoint is expecting.", required = true, content = @Content(mediaType = MediaType.APPLICATION_JSON, examples = @ExampleObject(name = "Example", value = "{\"email\": \"Example Email\", "
            +
            "\"Username\": \"Example Name\", \"admin\": 1," + "\"access_token\": \"sample_access_token\", "
            + "\"refresh_token\": \"sample_refresh_token\", " + "\"expires_at\": 1700000000, "
            + "\"scope\": [\"read\", \"write\"], " + "\"token_type\": \"Bearer\", "
            + "\"Notifications\": [\"Welcome message\"], " + "\"MyQuotes\": [\"Life is beautiful\"], "
            + "\"FavoriteQuote\": {\"Motivation\": [\"Keep going!\"]}, "
            + "\"SharedQuotes\": [\"Success is a journey\"], "
            + "\"MyTags\": [\"Inspiration\", \"Wisdom\"], " + "\"Description\": \"This is a test user.\"" + "}")))
    public Response create(String json) {
        return accountService.newUser(json);
    }

    @GET
    @Path("/search/{id}")
    public Response search(@PathParam("id") String id) {
        return accountService.retrieveUser(id, true);
    }

    @DELETE
    @Path("/delete/{id}")
    public Response delete(@PathParam("id") String id) {
        return accountService.deleteUser(id);
    }

    @PUT
    @Path("/update/{id}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response update(@PathParam("id") String id, String accountJson) {
        return accountService.updateUser(accountJson, id);
    }

    @GET
    @Path("/admin")
    @Produces(MediaType.TEXT_PLAIN)
    @RolesAllowed("admin")
    @Operation(summary = "Ignore me I am a test!")
    public Response adminOnly() {
        return Response.ok("Access granted to admin").build();
    }

    @GET
    @Path("/whoami")
    @Produces(MediaType.APPLICATION_JSON)
    @Operation(summary = "Ignore me I am a test!")
    public Response whoAmI(@Context HttpServletRequest request) {
        System.out.println(request.getCookies());
        Cookie jwtCookie = null;
        for (Cookie c : request.getCookies()) {
            if (c.getName().equals("jwt"))
                jwtCookie = c;
        }
        if (jwtCookie == null) {
            return Response
                    .status(Status.UNAUTHORIZED)
                    .entity("{\"error\": \"This endpoint requires authentication\" }")
                    .build();
        }
        try {
            JwtConsumer consumer = JwtConsumer.create("defaultJwtConsumer");
            JwtToken jwt = consumer.createJwt(jwtCookie.getValue());

            String id = jwt.getClaims().getSubject();
            return accountService.retrieveUser(id, false);
        } catch (InvalidConsumerException e) {
            System.out.println(e);
            return Response
                    .status(Status.INTERNAL_SERVER_ERROR)
                    .entity("{\"error\": \"JwtConsumer is incorrectly configured\" }")
                    .build();
        } catch (InvalidTokenException e) {
            System.out.println(e);
            return Response
                    .status(Status.UNAUTHORIZED)
                    .entity("{\"error\": \"Invalid JWT\" }")
                    .build();
        }
    }

    @GET
    @Path("/debug")
    @Produces(MediaType.APPLICATION_JSON)
    @Operation(summary = "Ignore me I am a test!")
    public Response debugJwt(@Context SecurityContext securityContext) {
        Principal user = securityContext.getUserPrincipal();
        JsonObjectBuilder json = Json.createObjectBuilder();

        if (user != null) {
            json.add("user", user.getName());
            json.add("rolesDetected", securityContext.isUserInRole("admin") ? "admin" : "none");
            json.add("test", securityContext.getUserPrincipal().toString());
            json.add("email", securityContext.getUserPrincipal().getName());
        } else {
            json.add("error", "JWT not recognized");
        }

        return Response.ok(json.build()).build();
    }

}
