package com.nyaysetu.backend.dto;

import com.nyaysetu.backend.model.LegalCase;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public class CaseDto {
    private Long id;
    private Long userId;
    private String userName;
    private Long lawyerId;
    private String lawyerName;
    private String caseNumber;
    private String title;
    private String description;
    private String category;
    private String courtName;
    private String status;
    private String priority;
    private LocalDate filingDate;
    private LocalDateTime nextHearingDate;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<CaseHearingDto> hearings;
    private List<CaseDocumentDto> documents;

    public CaseDto() {}

    public static CaseDto fromEntity(LegalCase c) {
        CaseDto dto = new CaseDto();
        dto.setId(c.getId());
        if (c.getUser() != null) {
            dto.setUserId(c.getUser().getId());
            dto.setUserName(c.getUser().getFullName());
        }
        if (c.getLawyer() != null) {
            dto.setLawyerId(c.getLawyer().getId());
            dto.setLawyerName(c.getLawyer().getName());
        }
        dto.setCaseNumber(c.getCaseNumber());
        dto.setTitle(c.getTitle());
        dto.setDescription(c.getDescription());
        dto.setCategory(c.getCategory());
        dto.setCourtName(c.getCourtName());
        dto.setStatus(c.getStatus());
        dto.setPriority(c.getPriority());
        dto.setFilingDate(c.getFilingDate());
        dto.setNextHearingDate(c.getNextHearingDate());
        dto.setCreatedAt(c.getCreatedAt());
        dto.setUpdatedAt(c.getUpdatedAt());
        return dto;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }

    public Long getLawyerId() { return lawyerId; }
    public void setLawyerId(Long lawyerId) { this.lawyerId = lawyerId; }

    public String getLawyerName() { return lawyerName; }
    public void setLawyerName(String lawyerName) { this.lawyerName = lawyerName; }

    public String getCaseNumber() { return caseNumber; }
    public void setCaseNumber(String caseNumber) { this.caseNumber = caseNumber; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getCourtName() { return courtName; }
    public void setCourtName(String courtName) { this.courtName = courtName; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }

    public LocalDate getFilingDate() { return filingDate; }
    public void setFilingDate(LocalDate filingDate) { this.filingDate = filingDate; }

    public LocalDateTime getNextHearingDate() { return nextHearingDate; }
    public void setNextHearingDate(LocalDateTime nextHearingDate) { this.nextHearingDate = nextHearingDate; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public List<CaseHearingDto> getHearings() { return hearings; }
    public void setHearings(List<CaseHearingDto> hearings) { this.hearings = hearings; }

    public List<CaseDocumentDto> getDocuments() { return documents; }
    public void setDocuments(List<CaseDocumentDto> documents) { this.documents = documents; }
}
