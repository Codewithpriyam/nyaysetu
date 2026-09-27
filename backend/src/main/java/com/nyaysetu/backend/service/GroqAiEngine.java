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
    private static final List<String> CANDIDATE_MODELS = List.of(
        "openai/gpt-oss-120b",
        "qwen/qwen3.8-27b",
        "llama-3.3-70b-versatile",
        "llama3-70b-8192"
    );

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
     */
    public String generateCompletion(String systemPrompt, String userPrompt) {
        String cleanUserPrompt = sanitizePrompt(userPrompt);

        log.info("[AI ENGINE] Prompt received: \"{}\"", cleanUserPrompt);

        if (groqApiKey == null || groqApiKey.isBlank()) {
            log.error("[AI ENGINE] Groq API Key missing or not configured.");
            throw new IllegalStateException("Groq API Key is missing or not configured on the backend server.");
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(groqApiKey.trim());

        Map<String, Object> systemMessage = Map.of("role", "system", "content", systemPrompt);
        Map<String, Object> userMessage = Map.of("role", "user", "content", cleanUserPrompt);

        Exception lastException = null;

        for (String modelName : CANDIDATE_MODELS) {
            try {
                log.info("[AI ENGINE] Request sent to Groq API (Model: {}, Endpoint: {})", modelName, GROQ_API_URL);

                Map<String, Object> requestBody = Map.of(
                    "model", modelName,
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
                                    log.info("[AI ENGINE] Groq response received successfully via model {} (Length: {} chars)", modelName, text.length());
                                    return text;
                                }
                            }
                        }
                    }
                }
            } catch (Exception e) {
                log.warn("[AI ENGINE] Failed with model {}: {}", modelName, e.getMessage());
                lastException = e;
            }
        }

        log.error("[AI ENGINE] All Groq candidate models failed.");
        throw new RuntimeException("Groq API Execution Failed across all models: " + (lastException != null ? lastException.getMessage() : "Unknown error"), lastException);
    }
}
