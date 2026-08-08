package com.nyaysetu.backend.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "consultations", indexes = {
    @Index(name = "idx_consultation_user", columnList = "user_id"),
    @Index(name = "idx_consultation_lawyer", columnList = "lawyer_id")
})
public class Consultation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "lawyer_id", nullable = false)
    private LawyerProfile lawyer;

    @Column(length = 2000)
    private String problem;

    private String category;
    private LocalDate requestedDate;
    private LocalDateTime scheduledAt;
    private Integer durationMinutes = 20;

    // Pricing Snapshot — retains historical rate even if lawyer changes price in future
    private Double ratePerMinute = 25.0;
    private Double totalAmount = 500.0;
    private Double price = 500.0; // Backward compatibility

    @Column(nullable = false)
    private String status = "REQUESTED";

    @Column(length = 500)
    private String meetLink;

    @Column(length = 50)
    private String utrNumber;

    private LocalDateTime createdAt;

    public Consultation() {}

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.ratePerMinute != null && this.durationMinutes != null) {
            this.totalAmount = this.ratePerMinute * this.durationMinutes;
            this.price = this.totalAmount;
        }
    }

    public void calculatePricingSnapshot(Double ratePerMinute, Integer durationMinutes) {
        this.ratePerMinute = ratePerMinute != null ? ratePerMinute : 25.0;
        this.durationMinutes = durationMinutes != null ? durationMinutes : 20;
        this.totalAmount = this.ratePerMinute * this.durationMinutes;
        this.price = this.totalAmount;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public LawyerProfile getLawyer() { return lawyer; }
    public void setLawyer(LawyerProfile lawyer) { this.lawyer = lawyer; }

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
