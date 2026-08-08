package com.nyaysetu.backend.controller;

import com.nyaysetu.backend.dto.ConsultationRequestDto;
import com.nyaysetu.backend.dto.ConsultationResponseDto;
import com.nyaysetu.backend.model.*;
import com.nyaysetu.backend.repository.ConsultationRepository;
import com.nyaysetu.backend.repository.ConsultationStatusHistoryRepository;
import com.nyaysetu.backend.repository.LawyerProfileRepository;
import com.nyaysetu.backend.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1")
@CrossOrigin(origins = "*")
public class ConsultationController {

    @Autowired
    private ConsultationRepository consultationRepository;

    @Autowired
    private LawyerProfileRepository lawyerProfileRepository;

    @Autowired
    private ConsultationStatusHistoryRepository statusHistoryRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @PostMapping("/consultations")
    public ResponseEntity<?> createConsultation(
            @AuthenticationPrincipal Object principal,
            @RequestBody ConsultationRequestDto requestDto) {

        if (!(principal instanceof User user)) {
            return ResponseEntity.status(401).body("Unauthenticated");
        }

        if (requestDto.getLawyerId() == null) {
            return ResponseEntity.badRequest().body("lawyerId is required");
        }

        Optional<LawyerProfile> lawyerOpt = lawyerProfileRepository.findById(requestDto.getLawyerId());
        if (lawyerOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Lawyer profile not found");
        }

        LawyerProfile lawyer = lawyerOpt.get();

        Consultation consultation = new Consultation();
        consultation.setUser(user);
        consultation.setLawyer(lawyer);
        consultation.setProblem(requestDto.getProblem());
        consultation.setCategory(requestDto.getCategory() != null ? requestDto.getCategory() : "General Consultation");
        consultation.setRequestedDate(requestDto.getRequestedDate());
        consultation.setUtrNumber(requestDto.getUtrNumber());
        consultation.setStatus("REQUESTED");

        // 1. Pricing Snapshot: Lock in lawyer's current ratePerMinute so future price changes don't alter past consultations
        Double rate = lawyer.getPricePerMinute() != null ? lawyer.getPricePerMinute() : 25.0;
        int duration = 20; // default session 20 mins
        consultation.calculatePricingSnapshot(rate, duration);

        Consultation saved = consultationRepository.save(consultation);

        // 3. Status History Tracking: record transition from null -> REQUESTED
        statusHistoryRepository.save(new ConsultationStatusHistory(saved, null, "REQUESTED", user.getClerkUserId()));

        // 6. Notification: Send alert to lawyer if linked user exists
        if (lawyer.getUser() != null) {
            notificationRepository.save(new Notification(
                lawyer.getUser(),
                "New Consultation Request",
                "You have a new consultation request from " + (user.getFullName() != null ? user.getFullName() : "a client") + ".",
                "CONSULTATION_REQUEST"
            ));
        }

        return ResponseEntity.ok(ConsultationResponseDto.fromEntity(saved, false));
    }

    @GetMapping("/me/consultations")
    public ResponseEntity<List<ConsultationResponseDto>> getMyConsultations(@AuthenticationPrincipal Object principal) {
        if (!(principal instanceof User user)) {
            return ResponseEntity.status(401).build();
        }

        List<Consultation> list = consultationRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
        List<ConsultationResponseDto> dtos = list.stream()
                .map(c -> {
                    boolean canSeeMeet = "READY".equalsIgnoreCase(c.getStatus()) ||
                                         "MEET_LINK_ADDED".equalsIgnoreCase(c.getStatus()) ||
                                         "SCHEDULED".equalsIgnoreCase(c.getStatus()) ||
                                         "COMPLETED".equalsIgnoreCase(c.getStatus());
                    return ConsultationResponseDto.fromEntity(c, canSeeMeet);
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(dtos);
    }
}
