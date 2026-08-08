package com.nyaysetu.backend.repository;

import com.nyaysetu.backend.model.AiConversation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AiConversationRepository extends JpaRepository<AiConversation, Long> {
    List<AiConversation> findByUserIdOrderByCreatedAtDesc(Long userId);
    List<AiConversation> findByUserIdAndLegalCaseIdOrderByCreatedAtDesc(Long userId, Long caseId);
}
