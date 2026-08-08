package com.nyaysetu.backend.dto;

import com.nyaysetu.backend.model.CaseHearing;
import java.time.LocalDate;

public class CaseHearingDto {
    private Long id;
    private Long caseId;
    private LocalDate hearingDate;
    private String hearingTime;
    private String courtName;
    private String remarks;
    private String status;

    public CaseHearingDto() {}

    public static CaseHearingDto fromEntity(CaseHearing ch) {
        CaseHearingDto dto = new CaseHearingDto();
        dto.setId(ch.getId());
        dto.setCaseId(ch.getLegalCase() != null ? ch.getLegalCase().getId() : null);
        dto.setHearingDate(ch.getHearingDate());
        dto.setHearingTime(ch.getHearingTime());
        dto.setCourtName(ch.getCourtName());
        dto.setRemarks(ch.getRemarks());
        dto.setStatus(ch.getStatus());
        return dto;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getCaseId() { return caseId; }
    public void setCaseId(Long caseId) { this.caseId = caseId; }

    public LocalDate getHearingDate() { return hearingDate; }
    public void setHearingDate(LocalDate hearingDate) { this.hearingDate = hearingDate; }

    public String getHearingTime() { return hearingTime; }
    public void setHearingTime(String hearingTime) { this.hearingTime = hearingTime; }

    public String getCourtName() { return courtName; }
    public void setCourtName(String courtName) { this.courtName = courtName; }

    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
