package com.nyaysetu.backend.repository;

import com.nyaysetu.backend.model.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {
    List<AuditLog> findByWhoOrderByTimestampDesc(String who);
}
