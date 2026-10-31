package com.nyaysetu.backend.controller;

import com.nyaysetu.backend.dto.CaseDto;
import com.nyaysetu.backend.dto.PaymentDto;
import com.nyaysetu.backend.dto.UserDto;
import com.nyaysetu.backend.model.*;
import com.nyaysetu.backend.repository.*;
import jakarta.servlet.http.HttpServletRequest;
import java.time.LocalDateTime;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/admin")
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

        double totalRevenue = verifiedPayments.stream()
            .mapToDouble(p -> p.getAmount() != null ? p.getAmount() : 0.0)
            .sum();

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

    // ─── 5. PAYMENTS MONITOR & VERIFICATION ─────────────────────────────────
    @GetMapping("/payments")
    public ResponseEntity<?> getAllPayments() {
        List<Payment> payments = paymentRepository.findAllByOrderByCreatedAtDesc();
        List<PaymentDto> dtos = payments.stream().map(PaymentDto::fromEntity).collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/payments/stats")
    public ResponseEntity<?> getPaymentStats() {
        List<Payment> list = paymentRepository.findAll();
        long totalCount = list.size();
        long verifiedCount = list.stream().filter(p -> "VERIFIED".equalsIgnoreCase(p.getStatus())).count();
        long pendingCount = list.stream().filter(p -> "PENDING".equalsIgnoreCase(p.getStatus())).count();
        long rejectedCount = list.stream().filter(p -> "REJECTED".equalsIgnoreCase(p.getStatus())).count();
        long youpiCount = list.stream().filter(p -> "YOUPI_UPI".equalsIgnoreCase(p.getPaymentMethod()) || (p.getGatewaySessionId() != null && !p.getGatewaySessionId().isBlank())).count();
        double totalVolume = list.stream().filter(p -> "VERIFIED".equalsIgnoreCase(p.getStatus()) && p.getAmount() != null).mapToDouble(Payment::getAmount).sum();

        double totalPlatformFee = list.stream().filter(p -> "VERIFIED".equalsIgnoreCase(p.getStatus()) && p.getPlatformFee() != null).mapToDouble(Payment::getPlatformFee).sum();
        double totalAdvocatePayout = list.stream().filter(p -> "VERIFIED".equalsIgnoreCase(p.getStatus()) && p.getAdvocatePayout() != null).mapToDouble(Payment::getAdvocatePayout).sum();
        long pendingPayoutCount = list.stream().filter(p -> "VERIFIED".equalsIgnoreCase(p.getStatus()) && ("PENDING_SETTLEMENT".equalsIgnoreCase(p.getPayoutStatus()) || p.getPayoutStatus() == null)).count();

        Map<String, Object> metrics = new HashMap<>();
        metrics.put("totalTransactions", totalCount);
        metrics.put("verifiedCount", verifiedCount);
        metrics.put("pendingCount", pendingCount);
        metrics.put("rejectedCount", rejectedCount);
        metrics.put("youpiCount", youpiCount);
        metrics.put("totalRevenue", totalVolume);
        metrics.put("totalPlatformFee", totalPlatformFee);
        metrics.put("totalAdvocatePayout", totalAdvocatePayout);
        metrics.put("pendingPayoutCount", pendingPayoutCount);
        metrics.put("averageAmount", verifiedCount > 0 ? (totalVolume / verifiedCount) : 500.0);
        metrics.put("gatewayStatus", "ACTIVE_HEALTHY");
        metrics.put("observerMesh", "SMS + GMAIL TRIPLE MESH ONLINE");
        metrics.put("routingModel", "METHOD_B_CENTRAL_ADMIN_ESCROW");
        metrics.put("adminVpa", "8873932040@ptsbi");

        return ResponseEntity.ok(metrics);
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
        p.setVerifiedBy("ADMIN");
        p.setVerifiedAt(LocalDateTime.now());
        paymentRepository.save(p);

        if (p.getConsultation() != null) {
            Consultation c = p.getConsultation();
            c.setStatus("VERIFIED".equalsIgnoreCase(status) ? "PAYMENT_VERIFIED" : "REJECTED");
            consultationRepository.save(c);
        }

        auditLogRepository.save(new AuditLog("ADMIN", "ADMIN_STATUS_" + status, "Payment", p.getId(), request.getRemoteAddr()));

        return ResponseEntity.ok(PaymentDto.fromEntity(p));
    }

    @PatchMapping("/payments/{id}/payout")
    public ResponseEntity<?> updatePayoutStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body,
            HttpServletRequest request) {

        String payoutStatus = body.getOrDefault("payoutStatus", "SETTLED");
        Optional<Payment> paymentOpt = paymentRepository.findById(id);

        if (paymentOpt.isEmpty()) return ResponseEntity.notFound().build();

        Payment p = paymentOpt.get();
        p.setPayoutStatus(payoutStatus);
        paymentRepository.save(p);

        auditLogRepository.save(new AuditLog("ADMIN", "ADMIN_PAYOUT_" + payoutStatus, "Payment", p.getId(), request.getRemoteAddr()));

        return ResponseEntity.ok(PaymentDto.fromEntity(p));
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
