package com.nyaysetu.backend.controller;

import com.nyaysetu.backend.dto.AiConversationDto;
import com.nyaysetu.backend.model.AiConversation;
import com.nyaysetu.backend.model.LegalCase;
import com.nyaysetu.backend.model.User;
import com.nyaysetu.backend.repository.AiConversationRepository;
import com.nyaysetu.backend.repository.CaseRepository;
import com.nyaysetu.backend.service.GroqAiEngine;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/ai")
@CrossOrigin(origins = "*")
public class AiController {

    private static final Logger log = LoggerFactory.getLogger(AiController.class);

    @Autowired
    private GroqAiEngine groqAiEngine;

    @Autowired
    private AiConversationRepository aiConversationRepository;

    @Autowired
    private CaseRepository caseRepository;

    // ─── Module 1, 2, 7: Conversational AI Assistant & Category Detection ──────
    @PostMapping("/chat")
    public ResponseEntity<?> askAiAssistant(
            @AuthenticationPrincipal Object principal,
            @RequestBody Map<String, String> body) {

        User user = (principal instanceof User u) ? u : null;

        String prompt = body.get("prompt");
        if (prompt == null || prompt.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Prompt is required"));
        }

        String systemPrompt = "You are NyayaSetu AI Copilot, an expert Indian legal assistant powered by Groq Llama-3 70B. " +
            "Analyze the user's issue and structure your response strictly as follows:\n" +
            "1. **Category Classification**: Identify the category (e.g. Consumer, Cyber, Employment, Property, Family, Finance, Criminal, Civil) with an estimated confidence score % (e.g. 92% Confidence).\n" +
            "2. **Simple Explanation**: Explain relevant Indian laws (Acts & Sections) in plain English.\n" +
            "3. **Practical Next Steps**: List 3 actionable steps.\n" +
            "4. **Lawyer Recommendation**: Explain why consulting a verified Bar Council advocate is recommended.\n" +
            "NEVER claim to be a licensed lawyer or guarantee legal outcomes.";

        try {
            log.info("[AI CONTROLLER] /api/v1/ai/chat received prompt length: {} chars", prompt.length());
            String response = groqAiEngine.generateCompletion(systemPrompt, prompt);

            if (user != null) {
                AiConversation conversation = new AiConversation(user, null, "ASSISTANT", prompt, response);
                aiConversationRepository.save(conversation);
            }

            return ResponseEntity.ok(Map.of(
                "prompt", prompt,
                "response", response,
                "categoryEstimate", "Groq Llama-3 70B (Live)",
                "disclaimer", GroqAiEngine.MANDATORY_DISCLAIMER
            ));
        } catch (Exception e) {
            log.error("[AI CONTROLLER] Error processing /api/v1/ai/chat: {}", e.getMessage());
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    // ─── Module 3: Document Analyzer ──────────────────────────────────────────
    @PostMapping("/analyze-document")
    public ResponseEntity<?> analyzeDocument(
            @AuthenticationPrincipal Object principal,
            @RequestBody Map<String, String> body) {

        User user = (principal instanceof User u) ? u : null;

        String documentText = body.get("documentText");
        if (documentText == null || documentText.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "documentText is required"));
        }

        String systemPrompt = "You are a Legal Document Analysis Engine. " +
            "Summarize the provided legal document, highlight key obligations & rights, identify missing critical clauses or risks, and explain complex legal terms in simple English.";

        try {
            String response = groqAiEngine.generateCompletion(systemPrompt, documentText);

            if (user != null) {
                AiConversation conversation = new AiConversation(user, null, "ANALYZER", "Document Analysis Request", response);
                aiConversationRepository.save(conversation);
            }

            return ResponseEntity.ok(Map.of("response", response));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    // ─── Module 4: Legal Draft Generator ─────────────────────────────────────
    @PostMapping("/generate-draft")
    public ResponseEntity<?> generateDraft(
            @AuthenticationPrincipal Object principal,
            @RequestBody Map<String, String> body) {

        User user = (principal instanceof User u) ? u : null;

        String draftType = body.getOrDefault("draftType", "Legal Notice");
        String details = body.get("details");

        String systemPrompt = "You are a Legal Draft Generator for Indian courts and statutory authorities. " +
            "Draft a formal, professional " + draftType + " based on the user's details. " +
            "Include proper legal headings, demand terms, 15-day notice clause, and placeholders for advocate signatures.";

        try {
            String response = groqAiEngine.generateCompletion(systemPrompt, details != null ? details : draftType + " template request");

            if (user != null) {
                AiConversation conversation = new AiConversation(user, null, "DRAFT_GENERATOR", "Draft: " + draftType, response);
                aiConversationRepository.save(conversation);
            }

            return ResponseEntity.ok(Map.of("draftType", draftType, "draftContent", response));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    // ─── Module 6: AI Action Plan Roadmap ───────────────────────────────────
    @PostMapping("/roadmap")
    public ResponseEntity<?> generateRoadmap(
            @AuthenticationPrincipal Object principal,
            @RequestBody Map<String, String> body) {

        User user = (principal instanceof User u) ? u : null;

        String issue = body.get("issue");

        String systemPrompt = "Generate a 5-step visual action plan roadmap for resolving the following legal issue under Indian law. " +
            "Format steps clearly (e.g., Step 1: Collect Evidence -> Step 2: Issue Legal Notice -> Step 3: File E-Daakhil Complaint).";

        try {
            String response = groqAiEngine.generateCompletion(systemPrompt, issue != null ? issue : "General legal dispute roadmap");

            if (user != null) {
                AiConversation conversation = new AiConversation(user, null, "ROADMAP", "Roadmap: " + issue, response);
                aiConversationRepository.save(conversation);
            }

            return ResponseEntity.ok(Map.of("roadmap", response));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    // ─── Module 5: Context-Aware Case AI ─────────────────────────────────────
    @PostMapping("/case-context")
    public ResponseEntity<?> askCaseContextAi(
            @AuthenticationPrincipal User user,
            @RequestBody Map<String, String> body) {

        if (user == null) return ResponseEntity.status(401).body(Map.of("error", "Unauthenticated"));

        String caseIdStr = body.get("caseId");
        String query = body.get("query");

        if (caseIdStr == null || query == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "caseId and query are required"));
        }

        Long caseId = Long.parseLong(caseIdStr);

        Optional<LegalCase> caseOpt = caseRepository.findByIdAndUserId(caseId, user.getId());
        if (caseOpt.isEmpty()) {
            return ResponseEntity.status(403).body(Map.of("error", "Forbidden: Case file not found or access denied."));
        }

        LegalCase c = caseOpt.get();
        String caseContext = "Case Number: " + c.getCaseNumber() + "\nTitle: " + c.getTitle() + "\nCategory: " + c.getCategory() + "\nCourt: " + c.getCourtName() + "\nStatus: " + c.getStatus();

        String systemPrompt = "You are analyzing Case #" + c.getCaseNumber() + " for its owner. Context:\n" + caseContext + "\nAnswer the user's inquiry specifically for this case context.";

        try {
            String response = groqAiEngine.generateCompletion(systemPrompt, query);

            AiConversation conversation = new AiConversation(user, c, "CASE_CONTEXT", query, response);
            aiConversationRepository.save(conversation);

            return ResponseEntity.ok(Map.of("caseNumber", c.getCaseNumber(), "response", response));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    // ─── Module 8: AI History Retrieval ──────────────────────────────────────
    @GetMapping("/history")
    public ResponseEntity<?> getAiHistory(@AuthenticationPrincipal User user) {
        if (user == null) return ResponseEntity.status(401).build();

        List<AiConversation> list = aiConversationRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
        List<AiConversationDto> dtos = list.stream().map(AiConversationDto::fromEntity).collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }
}
