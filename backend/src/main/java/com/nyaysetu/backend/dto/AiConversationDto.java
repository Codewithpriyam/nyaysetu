package com.nyaysetu.backend.dto;

import com.nyaysetu.backend.model.AiConversation;
import java.time.LocalDateTime;

public class AiConversationDto {
    private Long id;
    private Long userId;
    private Long caseId;
    private String moduleType;
    private String prompt;
    private String response;
    private LocalDateTime createdAt;

    public AiConversationDto() {}

    public static AiConversationDto fromEntity(AiConversation c) {
        AiConversationDto dto = new AiConversationDto();
        dto.setId(c.getId());
        dto.setUserId(c.getUser() != null ? c.getUser().getId() : null);
        dto.setCaseId(c.getLegalCase() != null ? c.getLegalCase().getId() : null);
        dto.setModuleType(c.getModuleType());
        dto.setPrompt(c.getPrompt());
        dto.setResponse(c.getResponse());
        dto.setCreatedAt(c.getCreatedAt());
        return dto;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public Long getCaseId() { return caseId; }
    public void setCaseId(Long caseId) { this.caseId = caseId; }

    public String getModuleType() { return moduleType; }
    public void setModuleType(String moduleType) { this.moduleType = moduleType; }

    public String getPrompt() { return prompt; }
    public void setPrompt(String prompt) { this.prompt = prompt; }

    public String getResponse() { return response; }
    public void setResponse(String response) { this.response = response; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
