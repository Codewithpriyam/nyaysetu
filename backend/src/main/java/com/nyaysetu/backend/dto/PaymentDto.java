package com.nyaysetu.backend.dto;

import com.nyaysetu.backend.model.Payment;
import java.time.LocalDateTime;

public class PaymentDto {
    private Long id;
    private Long consultationId;
    private Long userId;
    private String userName;
    private Long lawyerId;
    private String lawyerName;
    private Double amount;
    private String paymentMethod;
    private String utrNumber;
    private String paymentScreenshot;
    private String status;
    private String verifiedBy;
    private LocalDateTime verifiedAt;
    private LocalDateTime createdAt;

    public PaymentDto() {}

    public static PaymentDto fromEntity(Payment p) {
        PaymentDto dto = new PaymentDto();
        dto.setId(p.getId());
        if (p.getConsultation() != null) {
            dto.setConsultationId(p.getConsultation().getId());
            if (p.getConsultation().getUser() != null) {
                dto.setUserId(p.getConsultation().getUser().getId());
                dto.setUserName(p.getConsultation().getUser().getFullName());
            }
            if (p.getConsultation().getLawyer() != null) {
                dto.setLawyerId(p.getConsultation().getLawyer().getId());
                dto.setLawyerName(p.getConsultation().getLawyer().getName());
            }
        }
        dto.setAmount(p.getAmount());
        dto.setPaymentMethod(p.getPaymentMethod());
        dto.setUtrNumber(p.getUtrNumber());
        dto.setPaymentScreenshot(p.getPaymentScreenshot());
        dto.setStatus(p.getStatus());
        dto.setVerifiedBy(p.getVerifiedBy());
        dto.setVerifiedAt(p.getVerifiedAt());
        dto.setCreatedAt(p.getCreatedAt());
        return dto;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getConsultationId() { return consultationId; }
    public void setConsultationId(Long consultationId) { this.consultationId = consultationId; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }

    public Long getLawyerId() { return lawyerId; }
    public void setLawyerId(Long lawyerId) { this.lawyerId = lawyerId; }

    public String getLawyerName() { return lawyerName; }
    public void setLawyerName(String lawyerName) { this.lawyerName = lawyerName; }

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

    public String getVerifiedBy() { return verifiedBy; }
    public void setVerifiedBy(String verifiedBy) { this.verifiedBy = verifiedBy; }

    public LocalDateTime getVerifiedAt() { return verifiedAt; }
    public void setVerifiedAt(LocalDateTime verifiedAt) { this.verifiedAt = verifiedAt; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
