package com.nyaysetu.backend.config;

import com.nyaysetu.backend.model.User;
import com.nyaysetu.backend.service.UserService;
import org.springframework.core.convert.converter.Converter;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;
import java.util.Map;

@Component
public class ClerkJwtAuthenticationConverter implements Converter<Jwt, AbstractAuthenticationToken> {

    private final UserService userService;

    public ClerkJwtAuthenticationConverter(UserService userService) {
        this.userService = userService;
    }

    @Override
    public AbstractAuthenticationToken convert(@org.springframework.lang.NonNull Jwt jwt) {
        String clerkUserId = jwt.getSubject();
        if (clerkUserId == null || clerkUserId.isEmpty()) {
            return null;
        }

        // Extract email and name from Clerk JWT claims if available
        String email = jwt.getClaimAsString("email");
        if (email == null) {
            Map<String, Object> claims = jwt.getClaims();
            if (claims.containsKey("email_address")) {
                email = claims.get("email_address").toString();
            } else if (claims.containsKey("primary_email_address")) {
                email = claims.get("primary_email_address").toString();
            } else if (claims.containsKey("email_addresses")) {
                Object addrs = claims.get("email_addresses");
                if (addrs instanceof List && !((List<?>) addrs).isEmpty()) {
                    Object first = ((List<?>) addrs).get(0);
                    if (first instanceof Map) {
                        Object addrObj = ((Map<?, ?>) first).get("email_address");
                        if (addrObj != null) email = addrObj.toString();
                    } else if (first != null) {
                        email = first.toString();
                    }
                }
            }
        }

        String fullName = jwt.getClaimAsString("name");
        if (fullName == null) {
            String firstName = jwt.getClaimAsString("first_name");
            String lastName = jwt.getClaimAsString("last_name");
            if (firstName != null || lastName != null) {
                fullName = ((firstName != null ? firstName : "") + " " + (lastName != null ? lastName : "")).trim();
            }
        }

        // Synchronize or retrieve User in MySQL
        User user = userService.getOrCreateUser(clerkUserId, email, fullName);

        // Assign Spring Security authority based on database role (ROLE_USER, ROLE_LAWYER, ROLE_ADMIN)
        List<GrantedAuthority> authorities = Collections.singletonList(
            new SimpleGrantedAuthority("ROLE_" + user.getRole().name())
        );

        return new UsernamePasswordAuthenticationToken(user, jwt, authorities);
    }
}
