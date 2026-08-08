package com.nyaysetu.backend.dto;

public class UserDto {
    private Long id;
    private String clerkUserId;
    private String email;
    private String fullName;
    private String role;
    private Long lawyerProfileId;

    public UserDto() {}

    public UserDto(Long id, String clerkUserId, String email, String fullName, String role, Long lawyerProfileId) {
        this.id = id;
        this.clerkUserId = clerkUserId;
        this.email = email;
        this.fullName = fullName;
        this.role = role;
        this.lawyerProfileId = lawyerProfileId;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getClerkUserId() { return clerkUserId; }
    public void setClerkUserId(String clerkUserId) { this.clerkUserId = clerkUserId; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public Long getLawyerProfileId() { return lawyerProfileId; }
    public void setLawyerProfileId(Long lawyerProfileId) { this.lawyerProfileId = lawyerProfileId; }
}
