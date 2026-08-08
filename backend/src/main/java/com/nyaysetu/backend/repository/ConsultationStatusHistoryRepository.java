package com.nyaysetu.backend.repository;

import com.nyaysetu.backend.model.ConsultationStatusHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ConsultationStatusHistoryRepository extends JpaRepository<ConsultationStatusHistory, Long> {
    List<ConsultationStatusHistory> findByConsultationIdOrderByChangedAtAsc(Long consultationId);
}
