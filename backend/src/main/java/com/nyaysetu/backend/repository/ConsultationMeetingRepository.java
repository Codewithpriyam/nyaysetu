package com.nyaysetu.backend.repository;

import com.nyaysetu.backend.model.ConsultationMeeting;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ConsultationMeetingRepository extends JpaRepository<ConsultationMeeting, Long> {
    List<ConsultationMeeting> findByConsultationIdOrderByCreatedAtDesc(Long consultationId);
}
