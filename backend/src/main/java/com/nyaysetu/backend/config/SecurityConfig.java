package com.nyaysetu.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.header.writers.ReferrerPolicyHeaderWriter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    private final ClerkJwtAuthenticationConverter clerkJwtAuthenticationConverter;

    public SecurityConfig(ClerkJwtAuthenticationConverter clerkJwtAuthenticationConverter) {
        this.clerkJwtAuthenticationConverter = clerkJwtAuthenticationConverter;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> {}) // Handled by CorsConfig
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .headers(headers -> headers
                .frameOptions(frame -> frame.deny())
                .contentTypeOptions(content -> {})
                .httpStrictTransportSecurity(hsts -> hsts
                    .includeSubDomains(true)
                    .maxAgeInSeconds(31536000))
                .referrerPolicy(referrer -> referrer
                    .policy(ReferrerPolicyHeaderWriter.ReferrerPolicy.STRICT_ORIGIN_WHEN_CROSS_ORIGIN))
                .contentSecurityPolicy(csp -> csp
                    .policyDirectives("default-src 'self'; script-src 'self' 'unsafe-inline' https://striking-kid-70.clerk.accounts.dev; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' http://localhost:* https://striking-kid-70.clerk.accounts.dev https://api.qrserver.com; frame-ancestors 'none';"))
            )
            .authorizeHttpRequests(auth -> auth
                // Admin role protected endpoints (Must be declared before broader permitAll/authenticated matchers)
                .requestMatchers(HttpMethod.POST, "/api/v1/lawyers/**").hasRole("ADMIN")
                .requestMatchers("/api/v1/payments/youpi/simulate-success/**").hasRole("ADMIN")
                .requestMatchers("/api/v1/admin/**").hasRole("ADMIN")

                // Public endpoints
                .requestMatchers(HttpMethod.GET, "/api/v1/lawyers/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/v1/categories/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/v1/legal-guides/**").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/v1/ai/chat").permitAll()
                .requestMatchers("/api/v1/payments/youpi/webhook", "/api/v1/payments/youpi/status/**").permitAll()
                .requestMatchers("/h2-console/**", "/error", "/favicon.ico").permitAll()
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                // Authenticated heavy AI endpoints
                .requestMatchers(HttpMethod.POST, "/api/v1/ai/analyze-document", "/api/v1/ai/generate-draft", "/api/v1/ai/roadmap").authenticated()

                // Authenticated user endpoints
                .requestMatchers("/api/v1/me/**").authenticated()
                .requestMatchers(HttpMethod.POST, "/api/v1/consultations/**").authenticated()
                .requestMatchers(HttpMethod.GET, "/api/v1/me/consultations/**").authenticated()
                .requestMatchers("/api/v1/payments/**").authenticated()
                .requestMatchers("/api/v1/cases/**").authenticated()
                .requestMatchers("/api/v1/ai/**").authenticated()

                // Lawyer role protected endpoints
                .requestMatchers("/api/v1/lawyer/**").hasRole("LAWYER")

                // All other requests require authentication
                .anyRequest().authenticated()
            )
            .oauth2ResourceServer(oauth2 -> oauth2
                .jwt(jwt -> jwt.jwtAuthenticationConverter(clerkJwtAuthenticationConverter))
            );

        return http.build();
    }
}
