package com.nyaysetu.backend.repository;

import com.nyaysetu.backend.model.Document;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface DocumentRepository extends JpaRepository<Document, Long> {
    List<Document> findByUploadedById(Long uploadedById);
    List<Document> findByConsultationId(Long consultationId);
}
