package com.nyaysetu.backend.dto;

import com.nyaysetu.backend.model.Consultation;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class ConsultationResponseDto {
    private Long id;
    private Long userId;
    private String userName;
    private String userEmail;
    private Long lawyerId;
    private String lawyerName;
    private String lawyerCourt;
    private String problem;
    private String category;
    private LocalDate requestedDate;
    private LocalDateTime scheduledAt;
    private Integer durationMinutes;
    private Double ratePerMinute;
    private Double totalAmount;
    private Double price;
    private String status;
    private String meetLink;
    private String utrNumber;
    private LocalDateTime createdAt;

    public ConsultationResponseDto() {}

    public static ConsultationResponseDto fromEntity(Consultation c, boolean includeMeetLink) {
        ConsultationResponseDto dto = new ConsultationResponseDto();
        dto.setId(c.getId());
        dto.setUserId(c.getUser() != null ? c.getUser().getId() : null);
        dto.setUserName(c.getUser() != null ? c.getUser().getFullName() : null);
        dto.setUserEmail(c.getUser() != null ? c.getUser().getEmail() : null);
        dto.setLawyerId(c.getLawyer() != null ? c.getLawyer().getId() : null);
        dto.setLawyerName(c.getLawyer() != null ? c.getLawyer().getName() : null);
        dto.setLawyerCourt(c.getLawyer() != null ? c.getLawyer().getCourt() : null);
        dto.setProblem(c.getProblem());
        dto.setCategory(c.getCategory());
        dto.setRequestedDate(c.getRequestedDate());
        dto.setScheduledAt(c.getScheduledAt());
        dto.setDurationMinutes(c.getDurationMinutes());
        dto.setRatePerMinute(c.getRatePerMinute());
        dto.setTotalAmount(c.getTotalAmount());
        dto.setPrice(c.getPrice());
        dto.setStatus(c.getStatus());
        dto.setUtrNumber(c.getUtrNumber());
        dto.setCreatedAt(c.getCreatedAt());

        // Security rule: Only include meet link if authorized
        if (includeMeetLink) {
            dto.setMeetLink(c.getMeetLink());
        }

        return dto;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

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

    public String getLawyerCourt() { return lawyerCourt; }
    public void setLawyerCourt(String lawyerCourt) { this.lawyerCourt = lawyerCourt; }

    public String getProblem() { return problem; }
    public void setProblem(String problem) { this.problem = problem; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public LocalDate getRequestedDate() { return requestedDate; }
    public void setRequestedDate(LocalDate requestedDate) { this.requestedDate = requestedDate; }

    public LocalDateTime getScheduledAt() { return scheduledAt; }
    public void setScheduledAt(LocalDateTime scheduledAt) { this.scheduledAt = scheduledAt; }

    public Integer getDurationMinutes() { return durationMinutes; }
    public void setDurationMinutes(Integer durationMinutes) { this.durationMinutes = durationMinutes; }

    public Double getRatePerMinute() { return ratePerMinute; }
    public void setRatePerMinute(Double ratePerMinute) { this.ratePerMinute = ratePerMinute; }

    public Double getTotalAmount() { return totalAmount; }
    public void setTotalAmount(Double totalAmount) { this.totalAmount = totalAmount; }

    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getMeetLink() { return meetLink; }
    public void setMeetLink(String meetLink) { this.meetLink = meetLink; }

    public String getUtrNumber() { return utrNumber; }
    public void setUtrNumber(String utrNumber) { this.utrNumber = utrNumber; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
