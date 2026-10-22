package com.nyaysetu.backend.dto;

import com.nyaysetu.backend.model.Payment;
import java.time.LocalDateTime;

public class PaymentDto {
    private Long id;
    private Long consultationId;
    private Long userId;
    private String userName;
    private String userEmail;
    private Long lawyerId;
    private String lawyerName;
    private String lawyerEmail;
    private String lawyerCourt;
    private String consultationProblem;
    private String consultationCategory;
    private Double amount;
    private String paymentMethod;
    private String utrNumber;
    private String paymentScreenshot;
    private String status;
    private String gatewaySessionId;
    private String gatewayOrderId;
    private String gatewayStatus;
    private String customerPhone;
    private String customerEmail;
    private String receivingVpa;
    private Double platformFee;
    private Double advocatePayout;
    private String payoutStatus;
    private String verifiedBy;
    private LocalDateTime verifiedAt;
    private LocalDateTime createdAt;

    public PaymentDto() {}

    public static PaymentDto fromEntity(Payment p) {
        PaymentDto dto = new PaymentDto();
        dto.setId(p.getId());
        if (p.getConsultation() != null) {
            dto.setConsultationId(p.getConsultation().getId());
            dto.setConsultationProblem(p.getConsultation().getProblem());
            dto.setConsultationCategory(p.getConsultation().getCategory());
            if (p.getConsultation().getUser() != null) {
                dto.setUserId(p.getConsultation().getUser().getId());
                dto.setUserName(p.getConsultation().getUser().getFullName());
                dto.setUserEmail(p.getConsultation().getUser().getEmail());
            }
            if (p.getConsultation().getLawyer() != null) {
                dto.setLawyerId(p.getConsultation().getLawyer().getId());
                dto.setLawyerName(p.getConsultation().getLawyer().getName());
                dto.setLawyerCourt(p.getConsultation().getLawyer().getCourt());
                if (p.getConsultation().getLawyer().getUser() != null) {
                    dto.setLawyerEmail(p.getConsultation().getLawyer().getUser().getEmail());
                }
            }
        }
        dto.setAmount(p.getAmount());
        dto.setPaymentMethod(p.getPaymentMethod());
        dto.setUtrNumber(p.getUtrNumber());
        dto.setPaymentScreenshot(p.getPaymentScreenshot());
        dto.setStatus(p.getStatus());
        dto.setGatewaySessionId(p.getGatewaySessionId());
        dto.setGatewayOrderId(p.getGatewayOrderId());
        dto.setGatewayStatus(p.getGatewayStatus());
        dto.setCustomerPhone(p.getCustomerPhone());
        dto.setCustomerEmail(p.getCustomerEmail() != null ? p.getCustomerEmail() : dto.getUserEmail());
        dto.setReceivingVpa(p.getReceivingVpa());
        dto.setPlatformFee(p.getPlatformFee());
        dto.setAdvocatePayout(p.getAdvocatePayout());
        dto.setPayoutStatus(p.getPayoutStatus());
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

    public String getUserEmail() { return userEmail; }
    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }

    public Long getLawyerId() { return lawyerId; }
    public void setLawyerId(Long lawyerId) { this.lawyerId = lawyerId; }

    public String getLawyerName() { return lawyerName; }
    public void setLawyerName(String lawyerName) { this.lawyerName = lawyerName; }

    public String getLawyerEmail() { return lawyerEmail; }
    public void setLawyerEmail(String lawyerEmail) { this.lawyerEmail = lawyerEmail; }

    public String getLawyerCourt() { return lawyerCourt; }
    public void setLawyerCourt(String lawyerCourt) { this.lawyerCourt = lawyerCourt; }

    public String getConsultationProblem() { return consultationProblem; }
    public void setConsultationProblem(String consultationProblem) { this.consultationProblem = consultationProblem; }

    public String getConsultationCategory() { return consultationCategory; }
    public void setConsultationCategory(String consultationCategory) { this.consultationCategory = consultationCategory; }

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
