package com.nyaysetu.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "payments", indexes = {
    @Index(name = "idx_payment_consultation", columnList = "consultation_id"),
    @Index(name = "idx_payment_utr", columnList = "utrNumber"),
    @Index(name = "idx_payment_gateway_session", columnList = "gatewaySessionId"),
    @Index(name = "idx_payment_gateway_order", columnList = "gatewayOrderId")
})
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "consultation_id", nullable = false)
    private Consultation consultation;

    @Column(nullable = false)
    private Double amount;

    private String paymentMethod = "YOUPI_UPI"; // YOUPI_UPI, UPI, CASH

    @Column(length = 100)
    private String utrNumber;

    @Column(length = 500)
    private String paymentScreenshot;

    @Column(nullable = false)
    private String status = "PENDING"; // PENDING, VERIFIED, REJECTED, PROCESSING

    // YouPI PG V2 Gateway Integration Fields
    @Column(length = 100)
    private String gatewaySessionId;

    @Column(length = 100)
    private String gatewayOrderId;

    @Column(length = 50)
    private String gatewayStatus = "INITIATED"; // INITIATED, ACTIVE, QUEUED, PROCESSING, SUCCESS, FAILED, EXPIRED, CANCELLED

    @Column(length = 255)
    private String gatewaySignature;

    @Column(length = 20)
    private String customerPhone;

    @Column(length = 100)
    private String customerEmail;

    // Method B: Central Admin Bank Account Receiving & Split Payout Fields
    @Column(length = 255)
    private String receivingVpa = "8873932040@ptsbi";

    private Double platformFee = 0.0;     // e.g. 10% Platform share retained by Admin

    private Double advocatePayout = 0.0;  // e.g. 90% Advocate share to be settled

    @Column(length = 50)
    private String payoutStatus = "PENDING_SETTLEMENT"; // PENDING_SETTLEMENT, SETTLED

    private String verifiedBy;
    private LocalDateTime verifiedAt;
    private LocalDateTime createdAt;

    public Payment() {}

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Consultation getConsultation() { return consultation; }
    public void setConsultation(Consultation consultation) { this.consultation = consultation; }

    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }

    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }

    public String getUtrNumber() { return utrNumber; }
    public void setUtrNumber(String utrNumber) { this.utrNumber = utrNumber; }

    public String getPaymentScreenshot() { return paymentScreenshot; }
    public void setPaymentScreenshot(String paymentScreenshot) { this.paymentScreenshot = paymentScreenshot; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getGatewaySessionId() { return gatewaySessionId; }
    public void setGatewaySessionId(String gatewaySessionId) { this.gatewaySessionId = gatewaySessionId; }

    public String getGatewayOrderId() { return gatewayOrderId; }
    public void setGatewayOrderId(String gatewayOrderId) { this.gatewayOrderId = gatewayOrderId; }

    public String getGatewayStatus() { return gatewayStatus; }
    public void setGatewayStatus(String gatewayStatus) { this.gatewayStatus = gatewayStatus; }

    public String getGatewaySignature() { return gatewaySignature; }
    public void setGatewaySignature(String gatewaySignature) { this.gatewaySignature = gatewaySignature; }

    public String getCustomerPhone() { return customerPhone; }
    public void setCustomerPhone(String customerPhone) { this.customerPhone = customerPhone; }

    public String getCustomerEmail() { return customerEmail; }
    public void setCustomerEmail(String customerEmail) { this.customerEmail = customerEmail; }

    public String getReceivingVpa() { return receivingVpa; }
    public void setReceivingVpa(String receivingVpa) { this.receivingVpa = receivingVpa; }

    public Double getPlatformFee() { return platformFee; }
    public void setPlatformFee(Double platformFee) { this.platformFee = platformFee; }

    public Double getAdvocatePayout() { return advocatePayout; }
    public void setAdvocatePayout(Double advocatePayout) { this.advocatePayout = advocatePayout; }

    public String getPayoutStatus() { return payoutStatus; }
    public void setPayoutStatus(String payoutStatus) { this.payoutStatus = payoutStatus; }

    public String getVerifiedBy() { return verifiedBy; }
    public void setVerifiedBy(String verifiedBy) { this.verifiedBy = verifiedBy; }

    public LocalDateTime getVerifiedAt() { return verifiedAt; }
    public void setVerifiedAt(LocalDateTime verifiedAt) { this.verifiedAt = verifiedAt; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
