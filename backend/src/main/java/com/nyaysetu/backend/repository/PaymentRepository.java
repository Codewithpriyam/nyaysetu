package com.nyaysetu.backend.repository;

import com.nyaysetu.backend.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    Optional<Payment> findByConsultationId(Long consultationId);
    List<Payment> findByConsultationUserIdOrderByCreatedAtDesc(Long userId);
    List<Payment> findByConsultationLawyerIdOrderByCreatedAtDesc(Long lawyerId);
    Optional<Payment> findByIdAndConsultationLawyerId(Long id, Long lawyerId);
    Optional<Payment> findByIdAndConsultationUserId(Long id, Long userId);
}
