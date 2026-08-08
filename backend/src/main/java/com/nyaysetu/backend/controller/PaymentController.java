package com.nyaysetu.backend.controller;

import com.nyaysetu.backend.dto.PaymentDto;
import com.nyaysetu.backend.model.*;
import com.nyaysetu.backend.repository.*;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1")
@CrossOrigin(origins = "*")
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

        // Validate file type (Images only)
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            return ResponseEntity.badRequest().body("Only image files (PNG, JPG, JPEG, WEBP) are allowed.");
        }

        // Validate size (max 5MB)
        if (file.getSize() > 5 * 1024 * 1024) {
            return ResponseEntity.badRequest().body("File size exceeds maximum limit of 5MB.");
        }

        try {
            String uploadDir = "uploads/screenshots/";
            File dir = new File(uploadDir);
            if (!dir.exists()) dir.mkdirs();

            String origName = file.getOriginalFilename();
            String extension = ".png";
            if (origName != null && origName.contains(".")) {
                extension = origName.substring(origName.lastIndexOf("."));
            }

            String filename = "utr_" + UUID.randomUUID().toString() + extension;
            File destination = new File(dir, filename);
            file.transferTo(destination);

            String fileUrl = "/img/qrcodes/" + filename; // Or upload path reference
            return ResponseEntity.ok(Map.of("url", fileUrl, "filename", filename));

        } catch (IOException e) {
            return ResponseEntity.status(500).body("Failed to store payment screenshot: " + e.getMessage());
        }
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
