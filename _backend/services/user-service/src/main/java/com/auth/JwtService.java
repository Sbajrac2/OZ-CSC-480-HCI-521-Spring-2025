package com.auth;

import com.accounts.AccountService;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.ibm.websphere.security.jwt.*;
import jakarta.inject.Inject;
import org.bson.Document;

import static com.mongodb.client.model.Filters.eq;


public class JwtService {

    public  static String buildJwt(String email) {
        try {
//            AccountService accountService = new AccountService();
            Document user = AccountService.accountCollection.find(eq("email", email)).first();
            if (user == null) {
                //here is the error
//                throw new RuntimeException("User not found");
                user = new Document("email", email)
                        .append("admin", 0) // just giving user access
                        .append("name", email);


            }

            String[] groups;
            if (user.getInteger("admin") == 1) {
                groups = new String[]{"admin", "user"};
            } else {
                groups = new String[]{"user"};
            }

            return JwtBuilder.create("jwtFrontEndBuilder")
                    .claim(Claims.SUBJECT, email)
                    .claim("upn", email)
                    .claim("groups", groups)
                    .claim("aud", "frontend")
                    .buildJwt()
                    .compact();
        } catch (JwtException | InvalidClaimException | InvalidBuilderException e) {
            throw new RuntimeException(e);
        }
    }

}
