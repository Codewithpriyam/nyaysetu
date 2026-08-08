package com.nyaysetu.backend.repository;

import com.nyaysetu.backend.model.Consultation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ConsultationRepository extends JpaRepository<Consultation, Long> {
    List<Consultation> findByUserIdOrderByCreatedAtDesc(Long userId);
    List<Consultation> findByLawyerIdOrderByCreatedAtDesc(Long lawyerId);
    Optional<Consultation> findByIdAndLawyerId(Long id, Long lawyerId);
    Optional<Consultation> findByIdAndUserId(Long id, Long userId);
}
