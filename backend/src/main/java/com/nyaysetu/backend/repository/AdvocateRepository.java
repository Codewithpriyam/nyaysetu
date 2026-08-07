package com.nyaysetu.backend.repository;

import com.nyaysetu.backend.model.Advocate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AdvocateRepository extends JpaRepository<Advocate, Long> {

    List<Advocate> findByStateContainingIgnoreCaseAndDistrictContainingIgnoreCase(String state, String district);

    List<Advocate> findByStateContainingIgnoreCase(String state);
}
