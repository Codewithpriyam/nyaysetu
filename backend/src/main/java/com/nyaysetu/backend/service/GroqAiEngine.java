package com.nyaysetu.backend.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
public class GroqAiEngine {

    private static final Logger log = LoggerFactory.getLogger(GroqAiEngine.class);

    @Value("${groq.api.key:}")
    private String groqApiKey;

    private static final String GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
    private static final String MODEL_NAME = "llama-3.3-70b-versatile";

    public static final String MANDATORY_DISCLAIMER =
        "\n\n⚖️ *Disclaimer: This AI provides informational guidance based on Indian statutory law and is not a substitute for professional legal advice from a licensed advocate.*";

    private final RestTemplate restTemplate = new RestTemplate();

    public String sanitizePrompt(String rawInput) {
        if (rawInput == null) return "";
        String sanitized = rawInput.replaceAll("(?i)ignore previous instructions", "")
                                   .replaceAll("(?i)system prompt:", "")
                                   .replaceAll("(?i)api[_-]?key", "[REDACTED]")
                                   .trim();
        return sanitized.length() > 4000 ? sanitized.substring(0, 4000) : sanitized;
    }

    /**
     * Core LLM completion method connecting strictly to Groq API.
     * Throws RuntimeException on failure (No fallback text permitted).
     */
    public String generateCompletion(String systemPrompt, String userPrompt) {
        String cleanUserPrompt = sanitizePrompt(userPrompt);

        log.info("[AI ENGINE] Prompt received: \"{}\"", cleanUserPrompt);

        if (groqApiKey == null || groqApiKey.isBlank()) {
            log.error("[AI ENGINE] Groq API Key missing or not configured.");
            throw new IllegalStateException("Groq API Key is missing or not configured on the backend server.");
        }

        log.info("[AI ENGINE] Request sent to Groq API (Model: {}, Endpoint: {})", MODEL_NAME, GROQ_API_URL);

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(groqApiKey.trim());

            Map<String, Object> systemMessage = Map.of("role", "system", "content", systemPrompt);
            Map<String, Object> userMessage = Map.of("role", "user", "content", cleanUserPrompt);

            Map<String, Object> requestBody = Map.of(
                "model", MODEL_NAME,
                "messages", List.of(systemMessage, userMessage),
                "temperature", 0.3,
                "max_tokens", 1500
            );

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
            @SuppressWarnings("rawtypes")
            ResponseEntity<Map> response = restTemplate.postForEntity(GROQ_API_URL, entity, Map.class);

            @SuppressWarnings("rawtypes")
            Map responseBody = response.getBody();
            if (response.getStatusCode().is2xxSuccessful() && responseBody != null) {
                List<?> choices = (List<?>) responseBody.get("choices");
                if (choices != null && !choices.isEmpty()) {
                    Object firstChoiceObj = choices.get(0);
                    if (firstChoiceObj instanceof Map<?, ?> firstChoice) {
                        Object msgObj = firstChoice.get("message");
                        if (msgObj instanceof Map<?, ?> message) {
                            Object contentObj = message.get("content");
                            if (contentObj != null) {
                                String text = contentObj.toString() + MANDATORY_DISCLAIMER;
                                log.info("[AI ENGINE] Groq response received successfully (Length: {} chars)", text.length());
                                log.info("[AI ENGINE] Response returned to frontend.");
                                return text;
                            }
                        }
                    }
                }
            }

            log.error("[AI ENGINE] Groq API returned invalid response format");
            throw new RuntimeException("Groq API response did not contain expected completion text");
        } catch (Exception e) {
            log.error("[AI ENGINE] Exception calling Groq API: {}", e.getMessage(), e);
            throw new RuntimeException("Groq API Execution Failed: " + e.getMessage(), e);
        }
    }
}
