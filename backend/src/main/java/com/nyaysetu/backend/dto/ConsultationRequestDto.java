package com.nyaysetu.backend.dto;

import java.time.LocalDate;

public class ConsultationRequestDto {
    private Long lawyerId;
    private String problem;
    private String category;
    private LocalDate requestedDate;
    private String utrNumber;

    public ConsultationRequestDto() {}

    public Long getLawyerId() { return lawyerId; }
    public void setLawyerId(Long lawyerId) { this.lawyerId = lawyerId; }

    public String getProblem() { return problem; }
    public void setProblem(String problem) { this.problem = problem; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public LocalDate getRequestedDate() { return requestedDate; }
    public void setRequestedDate(LocalDate requestedDate) { this.requestedDate = requestedDate; }

    public String getUtrNumber() { return utrNumber; }
    public void setUtrNumber(String utrNumber) { this.utrNumber = utrNumber; }
}
