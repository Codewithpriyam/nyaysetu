package com.nyaysetu.backend.repository;

import com.nyaysetu.backend.model.CaseDocument;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CaseDocumentRepository extends JpaRepository<CaseDocument, Long> {
    List<CaseDocument> findByLegalCaseIdOrderByUploadedAtDesc(Long caseId);
}
