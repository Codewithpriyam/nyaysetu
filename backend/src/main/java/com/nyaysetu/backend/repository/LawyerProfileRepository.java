package com.nyaysetu.backend.repository;

import com.nyaysetu.backend.model.LawyerProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface LawyerProfileRepository extends JpaRepository<LawyerProfile, Long> {
    Optional<LawyerProfile> findBySlug(String slug);
    Optional<LawyerProfile> findByUserId(Long userId);
    Optional<LawyerProfile> findByUserClerkUserId(String clerkUserId);
}
