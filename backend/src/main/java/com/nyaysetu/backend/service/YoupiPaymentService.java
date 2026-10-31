package com.nyaysetu.backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.nyaysetu.backend.model.*;
import com.nyaysetu.backend.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class YoupiPaymentService {

    private static final Logger log = LoggerFactory.getLogger(YoupiPaymentService.class);

    @Value("${youpi.api.url:http://localhost:6100}")
    private String youpiApiUrl;

    @Value("${youpi.checkout.portal.url:http://localhost:7000}")
    private String youpiPortalUrl;

    @Value("${youpi.merchant.id:00000000-0000-0000-0000-000000000001}")
    private String merchantId;

    @Value("${youpi.webhook.secret:}")
    private String webhookSecret;

    @Value("${platform.payment.routing.model:CENTRAL_ADMIN}")
    private String paymentRoutingModel;

    @Value("${platform.admin.upi.vpa:8873932040@ptsbi}")
    private String adminVpa;

    @Value("${platform.admin.payee.name:NyayaSetu Legal}")
    private String adminPayeeName;

    @Value("${platform.commission.rate:0.10}")
    private Double commissionRate;

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private ConsultationRepository consultationRepository;

    @Autowired
    private ConsultationStatusHistoryRepository statusHistoryRepository;

    @Autowired
    private AuditLogRepository auditLogRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    /**
     * Initializes a YouPI-PG sovereign payment session.
     * Method B: Central Platform / Admin Bank Account routing.
     */
    public Map<String, Object> createPaymentSession(
            Consultation consultation,
            User user,
            LawyerProfile lawyer,
            Double amount,
            String customerPhone,
            String returnUrl) {

        String orderId = "NYAYA-" + consultation.getId() + "-" + (System.currentTimeMillis() % 1000000);
        String formattedAmount = String.format(Locale.US, "%.2f", amount != null ? amount : 500.0);

        // Method B: Route directly to Central Admin VPA
        String targetVpa = "CENTRAL_ADMIN".equalsIgnoreCase(paymentRoutingModel)
                ? adminVpa
                : ((lawyer != null && lawyer.getUpiId() != null && !lawyer.getUpiId().isBlank()) ? lawyer.getUpiId() : adminVpa);

        String payeeName = "CENTRAL_ADMIN".equalsIgnoreCase(paymentRoutingModel)
                ? adminPayeeName
                : ((lawyer != null && lawyer.getName() != null) ? lawyer.getName() : adminPayeeName);

        // Calculate 10% Platform fee and 90% Advocate payout
        double totalAmt = Double.parseDouble(formattedAmount);
        double platformFee = Math.round(totalAmt * (commissionRate != null ? commissionRate : 0.10) * 100.0) / 100.0;
        double advocatePayout = Math.round((totalAmt - platformFee) * 100.0) / 100.0;

        // Generate standard NPCI UPI URI string for Instant App Deeplinking & Vector QR
        String upiUri = buildUpiString(targetVpa, payeeName, formattedAmount, orderId);

        String paymentId = "youpi_sess_" + UUID.randomUUID().toString().replace("-", "").substring(0, 16);
        String checkoutUrl = youpiPortalUrl + "/checkout/" + paymentId;
        String status = "INITIATED";

        // Attempt direct call to running YouPI-PG Core API if available
        try {
            Map<String, Object> requestPayload = new HashMap<>();
            requestPayload.put("orderId", orderId);
            requestPayload.put("amount", formattedAmount);
            requestPayload.put("currency", "INR");
            requestPayload.put("description", "Consultation with " + (lawyer != null ? lawyer.getName() : "Advocate"));
            requestPayload.put("returnUrl", returnUrl != null ? returnUrl : "http://localhost:5173/dashboard");

            Map<String, String> customerMap = new HashMap<>();
            customerMap.put("name", user != null ? user.getFullName() : "Citizen User");
            customerMap.put("email", user != null ? user.getEmail() : "user@nyaysetu.in");
            customerMap.put("phoneNumber", customerPhone != null ? customerPhone : "9876543210");
            requestPayload.put("customer", customerMap);

            Map<String, Object> metadata = new HashMap<>();
            metadata.put("consultationId", consultation.getId());
            metadata.put("lawyerId", lawyer != null ? lawyer.getId() : null);
            metadata.put("routingModel", "CENTRAL_ADMIN");
            metadata.put("receivingVpa", targetVpa);
            metadata.put("platformFee", platformFee);
            metadata.put("advocatePayout", advocatePayout);
            metadata.put("platform", "NyayaSetu");
            requestPayload.put("metadata", metadata);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("X-Merchant-Id", merchantId);
            headers.set("X-Merchant-Key", webhookSecret);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestPayload, headers);
            ResponseEntity<String> response = restTemplate.postForEntity(youpiApiUrl + "/api/v1/payments", entity, String.class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                JsonNode resJson = objectMapper.readTree(response.getBody());
                if (resJson.has("paymentId")) paymentId = resJson.get("paymentId").asText();
                if (resJson.has("checkoutUrl")) checkoutUrl = resJson.get("checkoutUrl").asText();
                if (resJson.has("status")) status = resJson.get("status").asText();
            }
        } catch (Exception e) {
            log.info("YouPI-PG Gateway Central Admin Escrow mode: Session {} -> {}", paymentId, targetVpa);
        }

        // Persist Payment entity
        Payment payment = paymentRepository.findByConsultationId(consultation.getId()).orElse(new Payment());
        payment.setConsultation(consultation);
        payment.setAmount(totalAmt);
        payment.setPaymentMethod("YOUPI_UPI");
        payment.setGatewaySessionId(paymentId);
        payment.setGatewayOrderId(orderId);
        payment.setGatewayStatus(status);
        payment.setCustomerPhone(customerPhone);
        payment.setCustomerEmail(user != null ? user.getEmail() : null);
        payment.setReceivingVpa(targetVpa);
        payment.setPlatformFee(platformFee);
        payment.setAdvocatePayout(advocatePayout);
        payment.setPayoutStatus("PENDING_SETTLEMENT");
        payment.setStatus("PENDING");
        payment.setUtrNumber("PENDING-" + orderId);
        paymentRepository.save(payment);

        // Update consultation status
        consultation.setStatus("PAYMENT_PENDING");
        consultationRepository.save(consultation);

        Map<String, Object> result = new HashMap<>();
        result.put("paymentId", paymentId);
        result.put("orderId", orderId);
        result.put("amount", formattedAmount);
        result.put("currency", "INR");
        result.put("status", status);
        result.put("checkoutUrl", checkoutUrl);
        result.put("upiUri", upiUri);
        result.put("vpa", targetVpa);
        result.put("payeeName", payeeName);
        result.put("advocateName", lawyer != null ? lawyer.getName() : "Advocate");
        result.put("routingModel", "CENTRAL_ADMIN");
        result.put("platformFee", platformFee);
        result.put("advocatePayout", advocatePayout);
        result.put("consultationId", consultation.getId());

        return result;
    }

    /**
     * Verifies HMAC-SHA256 signatures dispatched from YouPI-PG observers.
     */
    public boolean verifyHmacSignature(String rawBody, String signatureHeader) {
        if (signatureHeader == null || signatureHeader.isBlank() || webhookSecret == null || webhookSecret.isBlank()) {
            return false;
        }

        try {
            String cleanedSig = signatureHeader.trim();
            if (cleanedSig.startsWith("sha256=")) {
                cleanedSig = cleanedSig.substring(7);
            }

            Mac sha256Hmac = Mac.getInstance("HmacSHA256");
            SecretKeySpec secretKey = new SecretKeySpec(webhookSecret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
            sha256Hmac.init(secretKey);

            byte[] hmacBytes = sha256Hmac.doFinal(rawBody.getBytes(StandardCharsets.UTF_8));
            StringBuilder sb = new StringBuilder();
            for (byte b : hmacBytes) {
                sb.append(String.format("%02x", b));
            }
            String calculatedHash = sb.toString();

            return MessageDigest.isEqual(
                    calculatedHash.getBytes(StandardCharsets.UTF_8),
                    cleanedSig.getBytes(StandardCharsets.UTF_8)
            );
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * Reconciles an authoritative webhook event from YouPI-PG observer.
     */
    public Payment processWebhookEvent(String rawBody, String signatureHeader) throws Exception {
        JsonNode node = objectMapper.readTree(rawBody);

        String event = node.path("event").asText("SUCCESS");
        String paymentId = node.path("paymentId").asText(null);
        String orderId = node.path("orderId").asText(null);
        String utr = node.path("utr").asText(null);

        if (utr == null || utr.isBlank()) {
            utr = "YOUPI-" + (System.currentTimeMillis() % 1000000000000L);
        }

        Optional<Payment> paymentOpt = Optional.empty();
        if (paymentId != null && !paymentId.isBlank()) {
            paymentOpt = paymentRepository.findByGatewaySessionId(paymentId);
        }
        if (paymentOpt.isEmpty() && orderId != null && !orderId.isBlank()) {
            paymentOpt = paymentRepository.findByGatewayOrderId(orderId);
        }

        if (paymentOpt.isEmpty()) {
            throw new IllegalArgumentException("Payment session not found for id: " + paymentId + " / orderId: " + orderId);
        }

        Payment payment = paymentOpt.get();
        Consultation consultation = payment.getConsultation();
        String oldStatus = consultation.getStatus();

        if ("SUCCESS".equalsIgnoreCase(event)) {
            payment.setStatus("VERIFIED");
            payment.setGatewayStatus("SUCCESS");
            payment.setUtrNumber(utr);
            payment.setGatewaySignature(signatureHeader);
            payment.setVerifiedBy("YOUPI_OBSERVER_WEBHOOK");
            payment.setVerifiedAt(LocalDateTime.now());
            paymentRepository.save(payment);

            consultation.setStatus("PAYMENT_VERIFIED");
            consultation.setUtrNumber(utr);
            consultationRepository.save(consultation);

            statusHistoryRepository.save(new ConsultationStatusHistory(
                    consultation, oldStatus, "PAYMENT_VERIFIED", "YOUPI_PG_OBSERVER"
            ));

            auditLogRepository.save(new AuditLog(
                    "YOUPI_OBSERVER", "WEBHOOK_PAYMENT_VERIFIED", "Payment", payment.getId(), "127.0.0.1"
            ));

            // Notify citizen & advocate
            if (consultation.getUser() != null) {
                notificationRepository.save(new Notification(
                        consultation.getUser(),
                        "Payment Verified by YouPI PG",
                        "Your UPI payment of ₹" + payment.getAmount() + " (UTR: " + utr + ") has been verified by sovereign banking observers. Your video session is confirmed!",
                        "PAYMENT_VERIFIED"
                ));
            }
            if (consultation.getLawyer() != null && consultation.getLawyer().getUser() != null) {
                notificationRepository.save(new Notification(
                        consultation.getLawyer().getUser(),
                        "Consultation Payment Settled",
                        "Received direct UPI payment ₹" + payment.getAmount() + " for Consultation #" + consultation.getId() + " (UTR: " + utr + ").",
                        "CONSULTATION_PAID"
                ));
            }
        } else if ("FAILED".equalsIgnoreCase(event) || "CANCELLED".equalsIgnoreCase(event)) {
            payment.setStatus("REJECTED");
            payment.setGatewayStatus(event);
            paymentRepository.save(payment);

            consultation.setStatus("REJECTED");
            consultationRepository.save(consultation);
        }

        return payment;
    }

    /**
     * Development / demo simulator to trigger instant bank observer credit detection.
     */
    public Payment simulateObserverCredit(String sessionId, String utr) {
        Optional<Payment> paymentOpt = paymentRepository.findByGatewaySessionId(sessionId);
        if (paymentOpt.isEmpty()) {
            paymentOpt = paymentRepository.findByGatewayOrderId(sessionId);
        }

        if (paymentOpt.isEmpty()) {
            throw new NoSuchElementException("Payment session not found: " + sessionId);
        }

        Payment payment = paymentOpt.get();
        Consultation consultation = payment.getConsultation();
        String finalUtr = (utr != null && !utr.isBlank()) ? utr : "YOUPI" + (100000000000L + (long)(Math.random() * 900000000000L));

        payment.setStatus("VERIFIED");
        payment.setGatewayStatus("SUCCESS");
        payment.setUtrNumber(finalUtr);
        payment.setVerifiedBy("YOUPI_OBSERVER_SIMULATOR");
        payment.setVerifiedAt(LocalDateTime.now());
        paymentRepository.save(payment);

        consultation.setStatus("PAYMENT_VERIFIED");
        consultation.setUtrNumber(finalUtr);
        consultationRepository.save(consultation);

        statusHistoryRepository.save(new ConsultationStatusHistory(
                consultation, "PAYMENT_PENDING", "PAYMENT_VERIFIED", "YOUPI_OBSERVER"
        ));

        auditLogRepository.save(new AuditLog(
                "YOUPI_SIMULATOR", "SIMULATED_PAYMENT_VERIFY", "Payment", payment.getId(), "127.0.0.1"
        ));

        return payment;
    }

    private String buildUpiString(String vpa, String payeeName, String amount, String orderId) {
        try {
            return String.format(
                    "upi://pay?pa=%s&pn=%s&am=%s&cu=INR&tn=%s&tr=%s",
                    URLEncoder.encode(vpa, StandardCharsets.UTF_8),
                    URLEncoder.encode(payeeName, StandardCharsets.UTF_8),
                    URLEncoder.encode(amount, StandardCharsets.UTF_8),
                    URLEncoder.encode("NyayaSetu Consultation", StandardCharsets.UTF_8),
                    URLEncoder.encode(orderId, StandardCharsets.UTF_8)
            );
        } catch (Exception e) {
            return "upi://pay?pa=" + vpa + "&pn=" + payeeName + "&am=" + amount + "&cu=INR&tn=NyayaSetu";
        }
    }
}
