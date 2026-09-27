package com.nyaysetu.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "lawyer_profiles")
public class LawyerProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", unique = true, nullable = true)
    private User user;

    @Column(nullable = false, unique = true)
    private String slug;

    @Column(nullable = false)
    private String name;

    private String court;
    private Integer experienceYears = 0;
    private Integer consultationCount = 0;

    // Per-minute pricing model
    private Double pricePerMinute = 25.0; // ₹25/min (20 mins = ₹500)

    private String profileImage;
    private String barCouncilNumber;
    private Boolean isAvailable = true;
    private Boolean isAcceptingClients = true;
    private Double averageRating = 4.9;
    private Integer totalReviews = 15;
    private String officeAddress;

    @Column(length = 2000)
    private String bio;

    private String upiId = "nyaysetu@upi";
    private String qrImage = "/img/qrcodes/priya_sharma_qr.png";

    private String languages;
    private String verificationStatus = "VERIFIED";

    private LocalDateTime createdAt;

    public LawyerProfile() {}

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public String getSlug() { return slug; }
    public void setSlug(String slug) { this.slug = slug; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCourt() { return court; }
    public void setCourt(String court) { this.court = court; }

    public Integer getExperienceYears() { return experienceYears; }
    public void setExperienceYears(Integer experienceYears) { this.experienceYears = experienceYears; }

    public Integer getConsultationCount() { return consultationCount; }
    public void setConsultationCount(Integer consultationCount) { this.consultationCount = consultationCount; }

    public Double getPricePerMinute() { 
        return (pricePerMinute != null && pricePerMinute > 0) ? pricePerMinute : 25.0; 
    }
    public void setPricePerMinute(Double pricePerMinute) { 
        this.pricePerMinute = (pricePerMinute != null && pricePerMinute > 0) ? pricePerMinute : 25.0; 
    }

    public String getProfileImage() { return profileImage; }
    public void setProfileImage(String profileImage) { this.profileImage = profileImage; }

    public String getBarCouncilNumber() { return barCouncilNumber; }
    public void setBarCouncilNumber(String barCouncilNumber) { this.barCouncilNumber = barCouncilNumber; }

    public Boolean getIsAvailable() { return isAvailable; }
    public void setIsAvailable(Boolean available) { isAvailable = available; }

    public Boolean getIsAcceptingClients() { return isAcceptingClients; }
    public void setIsAcceptingClients(Boolean acceptingClients) { isAcceptingClients = acceptingClients; }

    public Double getAverageRating() { return averageRating; }
    public void setAverageRating(Double averageRating) { this.averageRating = averageRating; }

    public Integer getTotalReviews() { return totalReviews; }
    public void setTotalReviews(Integer totalReviews) { this.totalReviews = totalReviews; }

    public String getOfficeAddress() { return officeAddress; }
    public void setOfficeAddress(String officeAddress) { this.officeAddress = officeAddress; }

    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }

    public String getUpiId() { return upiId; }
    public void setUpiId(String upiId) { this.upiId = upiId; }

    public String getQrImage() { return qrImage; }
    public void setQrImage(String qrImage) { this.qrImage = qrImage; }

    public String getLanguages() { return languages; }
    public void setLanguages(String languages) { this.languages = languages; }

    public String getVerificationStatus() { return verificationStatus; }
    public void setVerificationStatus(String verificationStatus) { this.verificationStatus = verificationStatus; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
