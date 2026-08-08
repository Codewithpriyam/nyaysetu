package com.nyaysetu.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;

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
            .authorizeHttpRequests(auth -> auth
                // Public endpoints
                .requestMatchers(HttpMethod.GET, "/api/v1/lawyers/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/v1/categories/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/v1/legal-guides/**").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/v1/ai/chat", "/api/v1/ai/analyze-document", "/api/v1/ai/generate-draft", "/api/v1/ai/roadmap").permitAll()
                .requestMatchers("/h2-console/**", "/error", "/favicon.ico").permitAll()
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                // Authenticated user endpoints
                .requestMatchers("/api/v1/me/**").authenticated()
                .requestMatchers(HttpMethod.POST, "/api/v1/consultations/**").authenticated()
                .requestMatchers(HttpMethod.GET, "/api/v1/me/consultations/**").authenticated()
                .requestMatchers("/api/v1/payments/**").authenticated()
                .requestMatchers("/api/v1/cases/**").authenticated()
                .requestMatchers("/api/v1/ai/**").authenticated()

                // Lawyer role protected endpoints
                .requestMatchers("/api/v1/lawyer/**").hasRole("LAWYER")

                // Admin role protected endpoints
                .requestMatchers("/api/v1/admin/**").hasRole("ADMIN")

                // All other requests require authentication
                .anyRequest().authenticated()
            )
            .oauth2ResourceServer(oauth2 -> oauth2
                .jwt(jwt -> jwt.jwtAuthenticationConverter(clerkJwtAuthenticationConverter))
            );

        return http.build();
    }
}
