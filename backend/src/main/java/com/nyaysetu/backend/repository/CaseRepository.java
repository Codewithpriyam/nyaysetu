package com.nyaysetu.backend.repository;

import com.nyaysetu.backend.model.LegalCase;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface CaseRepository extends JpaRepository<LegalCase, Long> {
    List<LegalCase> findByUserIdOrderByCreatedAtDesc(Long userId);
    List<LegalCase> findByLawyerIdOrderByCreatedAtDesc(Long lawyerId);
    Optional<LegalCase> findByIdAndUserId(Long id, Long userId);
    Optional<LegalCase> findByIdAndLawyerId(Long id, Long lawyerId);
    Optional<LegalCase> findByCaseNumber(String caseNumber);
}
