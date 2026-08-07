package com.nyaysetu.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "advocates")
public class Advocate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(length = 100)
    private String barEnrollment;

    private String phone;
    private String court;
    private String district;
    private String state;

    @Column(length = 500)
    private String address;

    private String specialization;
    private Integer experience;
    private Double rating;
    private Integer reviewsCount;
    private String source;

    public Advocate() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getBarEnrollment() { return barEnrollment; }
    public void setBarEnrollment(String barEnrollment) { this.barEnrollment = barEnrollment; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getCourt() { return court; }
    public void setCourt(String court) { this.court = court; }

    public String getDistrict() { return district; }
    public void setDistrict(String district) { this.district = district; }

    public String getState() { return state; }
    public void setState(String state) { this.state = state; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getSpecialization() { return specialization; }
    public void setSpecialization(String specialization) { this.specialization = specialization; }

    public Integer getExperience() { return experience; }
    public void setExperience(Integer experience) { this.experience = experience; }

    public Double getRating() { return rating; }
    public void setRating(Double rating) { this.rating = rating; }

    public Integer getReviewsCount() { return reviewsCount; }
    public void setReviewsCount(Integer reviewsCount) { this.reviewsCount = reviewsCount; }

    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }
}
