package com.nyaysetu.backend.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "case_hearings", indexes = {
    @Index(name = "idx_hearing_case", columnList = "case_id")
})
public class CaseHearing {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "case_id", nullable = false)
    private LegalCase legalCase;

    @Column(nullable = false)
    private LocalDate hearingDate;

    private String hearingTime;
    private String courtName;

    @Column(columnDefinition = "TEXT")
    private String remarks;

    private String status = "SCHEDULED"; // SCHEDULED, COMPLETED, ADJOURNED, CANCELLED

    public CaseHearing() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public LegalCase getLegalCase() { return legalCase; }
    public void setLegalCase(LegalCase legalCase) { this.legalCase = legalCase; }

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
