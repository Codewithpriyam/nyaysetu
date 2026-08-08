package com.nyaysetu.backend.controller;

import com.nyaysetu.backend.dto.CaseDto;
import com.nyaysetu.backend.dto.UserDto;
import com.nyaysetu.backend.model.*;
import com.nyaysetu.backend.repository.*;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/admin")
@CrossOrigin(origins = "*")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private LawyerProfileRepository lawyerProfileRepository;

    @Autowired
    private ConsultationRepository consultationRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private CaseRepository caseRepository;

    @Autowired
    private AiConversationRepository aiConversationRepository;

    @Autowired
    private AuditLogRepository auditLogRepository;

    private static final Map<String, Object> PLATFORM_SETTINGS = new HashMap<>();

    static {
        PLATFORM_SETTINGS.put("platformName", "NyayaSetu");
        PLATFORM_SETTINGS.put("supportEmail", "support@nyaysetu.in");
        PLATFORM_SETTINGS.put("contactNumber", "+91 1800 123 4900");
        PLATFORM_SETTINGS.put("defaultConsultationDuration", "20 Mins");
        PLATFORM_SETTINGS.put("defaultPricePerMinute", 25);
    }

    // ─── 1. ANALYTICS & PLATFORM STATS ──────────────────────────────────────
    @GetMapping("/stats")
    public ResponseEntity<?> getAdminStats() {
        long totalUsers = userRepository.count();
        long totalLawyers = lawyerProfileRepository.count();
        long totalConsultations = consultationRepository.count();
        long totalCases = caseRepository.count();
        long totalPayments = paymentRepository.count();
        long totalAiRequests = aiConversationRepository.count();

        List<Payment> verifiedPayments = paymentRepository.findAll().stream()
            .filter(p -> "VERIFIED".equalsIgnoreCase(p.getStatus()))
            .collect(Collectors.toList());

        double totalRevenue = 0.0;
        for (Payment p : verifiedPayments) {
            if (p.getAmount() != null) {
                totalRevenue += p.getAmount();
            }
        }

        Map<String, Object> stats = new HashMap<>();
        stats.put("registeredUsers", totalUsers);
        stats.put("registeredLawyers", totalLawyers);
        stats.put("totalConsultations", totalConsultations);
        stats.put("completedConsultations", consultationRepository.count());
        stats.put("totalCases", totalCases);
        stats.put("totalPayments", totalPayments);
        stats.put("verifiedPayments", verifiedPayments.size());
        stats.put("totalRevenue", totalRevenue);
        stats.put("totalAiRequests", totalAiRequests);
        stats.put("mostActiveLawyer", "Adv. Prince Kumar");
        stats.put("topCategory", "Consumer Protection");

        return ResponseEntity.ok(stats);
    }

    // ─── 2. USERS MANAGEMENT ────────────────────────────────────────────────
    @GetMapping("/users")
    public ResponseEntity<List<UserDto>> getAllUsers() {
        List<User> users = userRepository.findAll();
        List<UserDto> dtos = users.stream().map(u -> new UserDto(
            u.getId(), u.getClerkUserId(), u.getEmail(), u.getFullName(), u.getRole().name(), null
        )).collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    // ─── 3. LAWYER ONBOARDING & PROFILES ────────────────────────────────────
    @GetMapping("/lawyers/unlinked")
    public ResponseEntity<?> getUnlinkedLawyers() {
        List<LawyerProfile> unlinked = lawyerProfileRepository.findAll().stream()
            .filter(l -> l.getUser() == null)
            .collect(Collectors.toList());
        return ResponseEntity.ok(unlinked);
    }

    @PostMapping("/lawyers/{lawyerId}/map-user")
    public ResponseEntity<?> mapUserToLawyer(
            @PathVariable Long lawyerId,
            @RequestParam(required = false) String clerkUserId,
            @RequestParam(required = false) String email,
            HttpServletRequest request) {

        Optional<LawyerProfile> profileOpt = lawyerProfileRepository.findById(lawyerId);
        if (profileOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Lawyer profile not found");
        }

        Optional<User> userOpt = Optional.empty();
        if (clerkUserId != null && !clerkUserId.isBlank()) {
            userOpt = userRepository.findByClerkUserId(clerkUserId.trim());
        }
        if (userOpt.isEmpty() && email != null && !email.isBlank()) {
            userOpt = userRepository.findByEmail(email.trim());
        }

        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("User not found in database. The user must sign in via Clerk once first.");
        }

        User user = userOpt.get();
        user.setRole(Role.LAWYER);
        userRepository.save(user);

        LawyerProfile profile = profileOpt.get();
        profile.setUser(user);
        lawyerProfileRepository.save(profile);

        auditLogRepository.save(new AuditLog("ADMIN", "MAP_LAWYER_ACCOUNT", "LawyerProfile", profile.getId(), request.getRemoteAddr()));

        return ResponseEntity.ok(Map.of(
            "message", "Successfully mapped user " + user.getEmail() + " to LawyerProfile " + profile.getName(),
            "lawyerProfileId", profile.getId(),
            "newRole", user.getRole().name(),
            "userId", user.getId()
        ));
    }

    // ─── 4. CONSULTATIONS MANAGER ──────────────────────────────────────────
    @GetMapping("/consultations")
    public ResponseEntity<?> getAllConsultations() {
        List<Consultation> list = consultationRepository.findAll();
        return ResponseEntity.ok(list);
    }

    // ─── 5. PAYMENTS VERIFICATION ───────────────────────────────────────────
    @GetMapping("/payments")
    public ResponseEntity<?> getAllPayments() {
        List<Payment> payments = paymentRepository.findAll();
        return ResponseEntity.ok(payments);
    }

    @PatchMapping("/payments/{id}/verify")
    public ResponseEntity<?> verifyPayment(
            @PathVariable Long id,
            @RequestBody Map<String, String> body,
            HttpServletRequest request) {

        String status = body.getOrDefault("status", "VERIFIED");
        Optional<Payment> paymentOpt = paymentRepository.findById(id);

        if (paymentOpt.isEmpty()) return ResponseEntity.notFound().build();

        Payment p = paymentOpt.get();
        p.setStatus(status);
        paymentRepository.save(p);

        auditLogRepository.save(new AuditLog("ADMIN", "VERIFY_PAYMENT", "Payment", p.getId(), request.getRemoteAddr()));

        return ResponseEntity.ok(Map.of("message", "Payment " + status, "paymentId", p.getId()));
    }

    // ─── 6. CASES MANAGER ───────────────────────────────────────────────────
    @GetMapping("/cases")
    public ResponseEntity<List<CaseDto>> getAllCases() {
        List<LegalCase> cases = caseRepository.findAll();
        List<CaseDto> dtos = cases.stream().map(CaseDto::fromEntity).collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    // ─── 7. AI USAGE INSIGHTS ───────────────────────────────────────────────
    @GetMapping("/ai-stats")
    public ResponseEntity<?> getAiStats() {
        long totalConversations = aiConversationRepository.count();
        Map<String, Object> aiStats = Map.of(
            "totalAiRequests", totalConversations,
            "mostUsedCategory", "Consumer Protection",
            "averageResponseTimeMs", 420,
            "totalConversations", totalConversations
        );
        return ResponseEntity.ok(aiStats);
    }

    // ─── 8. PLATFORM SETTINGS ───────────────────────────────────────────────
    @GetMapping("/settings")
    public ResponseEntity<?> getSettings() {
        return ResponseEntity.ok(PLATFORM_SETTINGS);
    }

    @PostMapping("/settings")
    public ResponseEntity<?> updateSettings(@RequestBody Map<String, Object> body) {
        PLATFORM_SETTINGS.putAll(body);
        return ResponseEntity.ok(PLATFORM_SETTINGS);
    }
}
