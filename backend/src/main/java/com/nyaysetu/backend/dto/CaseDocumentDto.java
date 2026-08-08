package com.nyaysetu.backend.dto;

import com.nyaysetu.backend.model.CaseDocument;
import java.time.LocalDateTime;

public class CaseDocumentDto {
    private Long id;
    private Long caseId;
    private Long uploadedById;
    private String uploadedByName;
    private String documentType;
    private String filePath;
    private String fileName;
    private String mimeType;
    private LocalDateTime uploadedAt;

    public CaseDocumentDto() {}

    public static CaseDocumentDto fromEntity(CaseDocument cd) {
        CaseDocumentDto dto = new CaseDocumentDto();
        dto.setId(cd.getId());
        dto.setCaseId(cd.getLegalCase() != null ? cd.getLegalCase().getId() : null);
        if (cd.getUploadedBy() != null) {
            dto.setUploadedById(cd.getUploadedBy().getId());
            dto.setUploadedByName(cd.getUploadedBy().getFullName());
        }
        dto.setDocumentType(cd.getDocumentType());
        dto.setFilePath(cd.getFilePath());
        dto.setFileName(cd.getFileName());
        dto.setMimeType(cd.getMimeType());
        dto.setUploadedAt(cd.getUploadedAt());
        return dto;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getCaseId() { return caseId; }
    public void setCaseId(Long caseId) { this.caseId = caseId; }

    public Long getUploadedById() { return uploadedById; }
    public void setUploadedById(Long uploadedById) { this.uploadedById = uploadedById; }

    public String getUploadedByName() { return uploadedByName; }
    public void setUploadedByName(String uploadedByName) { this.uploadedByName = uploadedByName; }

    public String getDocumentType() { return documentType; }
    public void setDocumentType(String documentType) { this.documentType = documentType; }

    public String getFilePath() { return filePath; }
    public void setFilePath(String filePath) { this.filePath = filePath; }

    public String getFileName() { return fileName; }
    public void setFileName(String fileName) { this.fileName = fileName; }

    public String getMimeType() { return mimeType; }
    public void setMimeType(String mimeType) { this.mimeType = mimeType; }

    public LocalDateTime getUploadedAt() { return uploadedAt; }
    public void setUploadedAt(LocalDateTime uploadedAt) { this.uploadedAt = uploadedAt; }
}
