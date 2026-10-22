package com.nyaysetu.backend.controller;

import com.nyaysetu.backend.dto.PaymentDto;
import com.nyaysetu.backend.model.*;
import com.nyaysetu.backend.repository.*;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1")
public class PaymentController {

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private ConsultationRepository consultationRepository;

    @Autowired
    private LawyerProfileRepository lawyerProfileRepository;

    @Autowired
    private ConsultationStatusHistoryRepository statusHistoryRepository;

    @Autowired
    private AuditLogRepository auditLogRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private com.nyaysetu.backend.service.YoupiPaymentService youpiPaymentService;

    // ─── YouPI PG V2 Gateway Session Creation ────────────────────────────────
    @PostMapping("/payments/youpi/create")
    public ResponseEntity<?> createYoupiSession(
            @AuthenticationPrincipal Object principal,
            @RequestBody Map<String, Object> body) {

        if (!(principal instanceof User user)) {
            return ResponseEntity.status(401).body("Unauthenticated");
        }

        if (!body.containsKey("consultationId")) {
            return ResponseEntity.badRequest().body("consultationId is required");
        }

        Long consultationId = Long.parseLong(body.get("consultationId").toString());
        Optional<Consultation> consultationOpt = consultationRepository.findByIdAndUserId(consultationId, user.getId());
        if (consultationOpt.isEmpty()) {
            return ResponseEntity.status(403).body("Consultation not found or access denied.");
        }

        Consultation consultation = consultationOpt.get();
        LawyerProfile lawyer = consultation.getLawyer();
        Double amount = consultation.getTotalAmount() != null ? consultation.getTotalAmount() : 500.0;
        String phone = body.containsKey("phoneNumber") ? body.get("phoneNumber").toString() : null;
        String returnUrl = body.containsKey("returnUrl") ? body.get("returnUrl").toString() : null;

        Map<String, Object> session = youpiPaymentService.createPaymentSession(consultation, user, lawyer, amount, phone, returnUrl);
        return ResponseEntity.ok(session);
    }

    // ─── YouPI PG V2 Authoritative Webhook Endpoint ──────────────────────────
    @PostMapping("/payments/youpi/webhook")
    public ResponseEntity<?> handleYoupiWebhook(
            @RequestHeader(value = "X-Gateway-Signature", required = true) String signature,
            @RequestBody String rawBody) {

        if (signature == null || signature.isBlank() || !youpiPaymentService.verifyHmacSignature(rawBody, signature)) {
            return ResponseEntity.status(401).body(Map.of("error", "Unauthorized: Valid X-Gateway-Signature required"));
        }

        try {
            Payment payment = youpiPaymentService.processWebhookEvent(rawBody, signature);
            return ResponseEntity.ok(Map.of(
                "received", true,
                "paymentId", payment.getId(),
                "status", payment.getStatus(),
                "utr", payment.getUtrNumber() != null ? payment.getUtrNumber() : ""
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Webhook processing failed"));
        }
    }

    // ─── YouPI Session Status Polling ────────────────────────────────────────
    @GetMapping("/payments/youpi/status/{sessionId}")
    public ResponseEntity<?> getYoupiSessionStatus(@PathVariable String sessionId) {
        Optional<Payment> paymentOpt = paymentRepository.findByGatewaySessionId(sessionId);
        if (paymentOpt.isEmpty()) {
            paymentOpt = paymentRepository.findByGatewayOrderId(sessionId);
        }
        if (paymentOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(PaymentDto.fromEntity(paymentOpt.get()));
    }

    // ─── YouPI Simulated Bank Observer Credit (Demo / Testing) ───────────────
    @PostMapping("/payments/youpi/simulate-success/{sessionId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> simulatePaymentCredit(
            @PathVariable String sessionId,
            @RequestBody(required = false) Map<String, String> body) {
        String utr = (body != null && body.containsKey("utr")) ? body.get("utr") : null;
        try {
            Payment payment = youpiPaymentService.simulateObserverCredit(sessionId, utr);
            return ResponseEntity.ok(PaymentDto.fromEntity(payment));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Simulation request failed"));
        }
    }

    // ─── Citizen Payment Submission ─────────────────────────────────────────
    @PostMapping("/payments")
    public ResponseEntity<?> submitPayment(
            @AuthenticationPrincipal Object principal,
            @RequestBody Map<String, Object> body) {

        if (!(principal instanceof User user)) {
            return ResponseEntity.status(401).body("Unauthenticated");
        }

        if (!body.containsKey("consultationId") || !body.containsKey("utrNumber")) {
            return ResponseEntity.badRequest().body("consultationId and utrNumber are required");
        }

        Long consultationId = Long.parseLong(body.get("consultationId").toString());
        String utrNumber = body.get("utrNumber").toString().trim();
        String paymentScreenshot = body.containsKey("paymentScreenshot") ? body.get("paymentScreenshot").toString() : null;

        if (utrNumber.length() < 6) {
            return ResponseEntity.badRequest().body("Valid UTR Number is required");
        }

        // OBJECT-LEVEL SECURITY: Ensure user owns this consultation
        Optional<Consultation> consultationOpt = consultationRepository.findByIdAndUserId(consultationId, user.getId());
        if (consultationOpt.isEmpty()) {
            return ResponseEntity.status(403).body("Forbidden: Consultation not found or unauthorized.");
        }

        Consultation consultation = consultationOpt.get();
        String oldStatus = consultation.getStatus();

        // Save or update Payment record
        Payment payment = paymentRepository.findByConsultationId(consultationId).orElse(new Payment());
        payment.setConsultation(consultation);
        payment.setAmount(consultation.getTotalAmount() != null ? consultation.getTotalAmount() : 500.0);
        payment.setPaymentMethod("UPI");
        payment.setUtrNumber(utrNumber);
        payment.setPaymentScreenshot(paymentScreenshot);
        payment.setStatus("PENDING");

        Payment savedPayment = paymentRepository.save(payment);

        // Update consultation status -> PAYMENT_PENDING
        consultation.setUtrNumber(utrNumber);
        consultation.setStatus("PAYMENT_PENDING");
        consultationRepository.save(consultation);

        // Track Status History
        statusHistoryRepository.save(new ConsultationStatusHistory(consultation, oldStatus, "PAYMENT_PENDING", user.getClerkUserId()));

        // Notify Advocate
        if (consultation.getLawyer() != null && consultation.getLawyer().getUser() != null) {
            notificationRepository.save(new Notification(
                consultation.getLawyer().getUser(),
                "Payment Submitted for Verification",
                "Client " + (user.getFullName() != null ? user.getFullName() : "") + " submitted UTR: " + utrNumber + " for verification.",
                "PAYMENT_SUBMITTED"
            ));
        }

        return ResponseEntity.ok(PaymentDto.fromEntity(savedPayment));
    }

    // ─── Payment Screenshot Upload Endpoint ──────────────────────────────────
    @PostMapping("/payments/upload-screenshot")
    public ResponseEntity<?> uploadScreenshot(
            @AuthenticationPrincipal User user,
            @RequestParam("file") MultipartFile file) {

        if (user == null) {
            return ResponseEntity.status(401).body("Unauthenticated");
        }

        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("File is empty");
        }

        // Validate size (max 5MB)
        if (file.getSize() > 5 * 1024 * 1024) {
            return ResponseEntity.badRequest().body("File size exceeds maximum limit of 5MB.");
        }

        // Validate client content type
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            return ResponseEntity.badRequest().body("Only image files (PNG, JPG, JPEG, WEBP) are allowed.");
        }

        // Validate file extension against whitelist
        String origName = file.getOriginalFilename();
        if (origName != null) {
            String lower = origName.toLowerCase();
            if (!lower.endsWith(".png") && !lower.endsWith(".jpg") && !lower.endsWith(".jpeg") && !lower.endsWith(".webp")) {
                return ResponseEntity.badRequest().body("Unsupported file extension. Allowed: .png, .jpg, .jpeg, .webp");
            }
        }

        // Inspect Magic Bytes to strictly verify genuine image file format (prevents MIME spoofing)
        String verifiedExtension;
        try {
            verifiedExtension = detectImageExtension(file);
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Failed to inspect file contents.");
        }

        if (verifiedExtension == null) {
            return ResponseEntity.badRequest().body("File content does not match an authentic image format (PNG, JPG, WEBP).");
        }

        try {
            File dir = new File("uploads/screenshots/");
            if (!dir.exists()) dir.mkdirs();

            String filename = "utr_" + UUID.randomUUID().toString() + verifiedExtension;
            File destination = new File(dir, filename);
            file.transferTo(destination);

            String fileUrl = "/img/qrcodes/" + filename;
            return ResponseEntity.ok(Map.of("url", fileUrl, "filename", filename));

        } catch (IOException e) {
            return ResponseEntity.status(500).body("Failed to store payment screenshot.");
        }
    }

    private String detectImageExtension(MultipartFile file) throws IOException {
        try (InputStream is = file.getInputStream()) {
            byte[] header = new byte[12];
            int read = is.read(header);
            if (read >= 8) {
                // PNG: 89 50 4E 47 0D 0A 1A 0A
                if ((header[0] & 0xFF) == 0x89 && header[1] == 'P' && header[2] == 'N' && header[3] == 'G'
                        && header[4] == 0x0D && header[5] == 0x0A && header[6] == 0x1A && header[7] == 0x0A) {
                    return ".png";
                }
                // JPEG: FF D8 FF
                if ((header[0] & 0xFF) == 0xFF && (header[1] & 0xFF) == 0xD8 && (header[2] & 0xFF) == 0xFF) {
                    return ".jpg";
                }
                // WEBP: 'R' 'I' 'F' 'F' ... 'W' 'E' 'B' 'P'
                if (read >= 12 && header[0] == 'R' && header[1] == 'I' && header[2] == 'F' && header[3] == 'F'
                        && header[8] == 'W' && header[9] == 'E' && header[10] == 'B' && header[11] == 'P') {
                    return ".webp";
                }
            }
        }
        return null;
    }

    // ─── Citizen Payment List ────────────────────────────────────────────────
    @GetMapping("/me/payments")
    public ResponseEntity<?> getMyPayments(@AuthenticationPrincipal User user) {
        if (user == null) return ResponseEntity.status(401).build();

        List<Payment> list = paymentRepository.findByConsultationUserIdOrderByCreatedAtDesc(user.getId());
        List<PaymentDto> dtos = list.stream().map(PaymentDto::fromEntity).collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    // ─── Lawyer Payment List & Verification ─────────────────────────────────
    @GetMapping("/lawyer/payments")
    public ResponseEntity<?> getLawyerAssignedPayments(@AuthenticationPrincipal User user) {
        if (user == null) return ResponseEntity.status(401).build();

        Optional<LawyerProfile> lawyerOpt = lawyerProfileRepository.findByUserId(user.getId());
        if (lawyerOpt.isEmpty()) {
            return ResponseEntity.status(403).body("User is not an assigned LawyerProfile");
        }

        // OBJECT-LEVEL SECURITY: Return only payments for consultations assigned to THIS lawyer
        List<Payment> list = paymentRepository.findByConsultationLawyerIdOrderByCreatedAtDesc(lawyerOpt.get().getId());
        List<PaymentDto> dtos = list.stream().map(PaymentDto::fromEntity).collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @PatchMapping("/lawyer/payments/{paymentId}/verify")
    public ResponseEntity<?> verifyPayment(
            @AuthenticationPrincipal User user,
            @PathVariable Long paymentId,
            HttpServletRequest request) {

        if (user == null) return ResponseEntity.status(401).build();

        Optional<LawyerProfile> lawyerOpt = lawyerProfileRepository.findByUserId(user.getId());
        if (lawyerOpt.isEmpty()) {
            return ResponseEntity.status(403).body("Access Denied");
        }

        // OBJECT-LEVEL SECURITY: Verify lawyer owns this payment's consultation
        Optional<Payment> paymentOpt = paymentRepository.findByIdAndConsultationLawyerId(paymentId, lawyerOpt.get().getId());
        if (paymentOpt.isEmpty()) {
            return ResponseEntity.status(403).body("Forbidden: Payment record not found or access denied.");
        }

        Payment payment = paymentOpt.get();
        payment.setStatus("VERIFIED");
        payment.setVerifiedBy(user.getClerkUserId());
        payment.setVerifiedAt(LocalDateTime.now());
        paymentRepository.save(payment);

        // Update Consultation status -> PAYMENT_VERIFIED
        Consultation consultation = payment.getConsultation();
        String oldStatus = consultation.getStatus();
        consultation.setStatus("PAYMENT_VERIFIED");
        consultationRepository.save(consultation);

        // Record Status History & Audit Log
        statusHistoryRepository.save(new ConsultationStatusHistory(consultation, oldStatus, "PAYMENT_VERIFIED", user.getClerkUserId()));
        auditLogRepository.save(new AuditLog(user.getClerkUserId(), "LAWYER_VERIFY_PAYMENT", "Payment", payment.getId(), request.getRemoteAddr()));

        // Notify Citizen
        if (consultation.getUser() != null) {
            notificationRepository.save(new Notification(
                consultation.getUser(),
                "Payment Verified!",
                "Your UPI payment (UTR: " + payment.getUtrNumber() + ") has been verified by " + lawyerOpt.get().getName() + ". Preparing schedule!",
                "PAYMENT_VERIFIED"
            ));
        }

        return ResponseEntity.ok(PaymentDto.fromEntity(payment));
    }

    @PatchMapping("/lawyer/payments/{paymentId}/reject")
    public ResponseEntity<?> rejectPayment(
            @AuthenticationPrincipal User user,
            @PathVariable Long paymentId,
            HttpServletRequest request) {

        if (user == null) return ResponseEntity.status(401).build();

        Optional<LawyerProfile> lawyerOpt = lawyerProfileRepository.findByUserId(user.getId());
        if (lawyerOpt.isEmpty()) {
            return ResponseEntity.status(403).body("Access Denied");
        }

        Optional<Payment> paymentOpt = paymentRepository.findByIdAndConsultationLawyerId(paymentId, lawyerOpt.get().getId());
        if (paymentOpt.isEmpty()) {
            return ResponseEntity.status(403).body("Forbidden: Payment record not found or access denied.");
        }

        Payment payment = paymentOpt.get();
        payment.setStatus("REJECTED");
        payment.setVerifiedBy(user.getClerkUserId());
        payment.setVerifiedAt(LocalDateTime.now());
        paymentRepository.save(payment);

        Consultation consultation = payment.getConsultation();
        String oldStatus = consultation.getStatus();
        consultation.setStatus("REJECTED");
        consultationRepository.save(consultation);

        statusHistoryRepository.save(new ConsultationStatusHistory(consultation, oldStatus, "REJECTED", user.getClerkUserId()));
        auditLogRepository.save(new AuditLog(user.getClerkUserId(), "LAWYER_REJECT_PAYMENT", "Payment", payment.getId(), request.getRemoteAddr()));

        if (consultation.getUser() != null) {
            notificationRepository.save(new Notification(
                consultation.getUser(),
                "Payment Rejected",
                "Your UPI payment verification (UTR: " + payment.getUtrNumber() + ") could not be verified. Please check UTR details.",
                "PAYMENT_REJECTED"
            ));
        }

        return ResponseEntity.ok(PaymentDto.fromEntity(payment));
    }
}
