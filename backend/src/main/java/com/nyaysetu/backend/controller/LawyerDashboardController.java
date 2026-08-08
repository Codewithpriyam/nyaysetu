package com.nyaysetu.backend.controller;

import com.nyaysetu.backend.dto.ConsultationResponseDto;
import com.nyaysetu.backend.model.*;
import com.nyaysetu.backend.repository.*;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/lawyer")
@PreAuthorize("hasRole('LAWYER')")
@CrossOrigin(origins = "*")
public class LawyerDashboardController {

    @Autowired
    private ConsultationRepository consultationRepository;

    @Autowired
    private LawyerProfileRepository lawyerProfileRepository;

    @Autowired
    private ConsultationMeetingRepository meetingRepository;

    @Autowired
    private ConsultationStatusHistoryRepository statusHistoryRepository;

    @Autowired
    private AuditLogRepository auditLogRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    private LawyerProfile getAuthenticatedLawyerProfile(User user) {
        if (user == null) return null;
        return lawyerProfileRepository.findByUserId(user.getId()).orElse(null);
    }

    @GetMapping("/requests")
    public ResponseEntity<?> getAssignedRequests(@AuthenticationPrincipal Object principal) {
        if (!(principal instanceof User user)) return ResponseEntity.status(401).body("Unauthenticated");
        LawyerProfile lawyerProfile = getAuthenticatedLawyerProfile(user);
        if (lawyerProfile == null) {
            return ResponseEntity.status(403).body("User does not have an assigned LawyerProfile");
        }

        // OBJECT-LEVEL AUTHORIZATION: Only return consultations belonging to THIS lawyer's profile
        List<Consultation> list = consultationRepository.findByLawyerIdOrderByCreatedAtDesc(lawyerProfile.getId());
        List<ConsultationResponseDto> dtos = list.stream()
                .map(c -> ConsultationResponseDto.fromEntity(c, true))
                .collect(Collectors.toList());

        return ResponseEntity.ok(dtos);
    }

    @PatchMapping("/consultations/{id}/accept")
    public ResponseEntity<?> acceptRequest(
            @AuthenticationPrincipal User user,
            @PathVariable Long id,
            HttpServletRequest request) {

        LawyerProfile lawyerProfile = getAuthenticatedLawyerProfile(user);
        if (lawyerProfile == null) {
            return ResponseEntity.status(403).body("Access Denied");
        }

        Optional<Consultation> consultationOpt = consultationRepository.findByIdAndLawyerId(id, lawyerProfile.getId());
        if (consultationOpt.isEmpty()) {
            return ResponseEntity.status(403).body("Forbidden: You do not have permission to access or modify this consultation.");
        }

        Consultation consultation = consultationOpt.get();
        String oldStatus = consultation.getStatus();
        consultation.setStatus("ACCEPTED");
        Consultation updated = consultationRepository.save(consultation);

        // 3. Status History Tracking
        statusHistoryRepository.save(new ConsultationStatusHistory(updated, oldStatus, "ACCEPTED", user.getClerkUserId()));

        // 5. Audit Log
        auditLogRepository.save(new AuditLog(user.getClerkUserId(), "LAWYER_ACCEPT_CONSULTATION", "Consultation", updated.getId(), request.getRemoteAddr()));

        // 6. Notification to User
        if (updated.getUser() != null) {
            notificationRepository.save(new Notification(updated.getUser(), "Consultation Accepted", "Your request has been accepted by " + lawyerProfile.getName() + ".", "CONSULTATION_ACCEPTED"));
        }

        return ResponseEntity.ok(ConsultationResponseDto.fromEntity(updated, true));
    }

    @PatchMapping("/consultations/{id}/reject")
    public ResponseEntity<?> rejectRequest(
            @AuthenticationPrincipal User user,
            @PathVariable Long id,
            HttpServletRequest request) {

        LawyerProfile lawyerProfile = getAuthenticatedLawyerProfile(user);
        if (lawyerProfile == null) {
            return ResponseEntity.status(403).body("Access Denied");
        }

        Optional<Consultation> consultationOpt = consultationRepository.findByIdAndLawyerId(id, lawyerProfile.getId());
        if (consultationOpt.isEmpty()) {
            return ResponseEntity.status(403).body("Forbidden: You do not have permission to access or modify this consultation.");
        }

        Consultation consultation = consultationOpt.get();
        String oldStatus = consultation.getStatus();
        consultation.setStatus("REJECTED");
        Consultation updated = consultationRepository.save(consultation);

        // 3. Status History Tracking
        statusHistoryRepository.save(new ConsultationStatusHistory(updated, oldStatus, "REJECTED", user.getClerkUserId()));

        // 5. Audit Log
        auditLogRepository.save(new AuditLog(user.getClerkUserId(), "LAWYER_REJECT_CONSULTATION", "Consultation", updated.getId(), request.getRemoteAddr()));

        return ResponseEntity.ok(ConsultationResponseDto.fromEntity(updated, true));
    }

    @PatchMapping("/consultations/{id}/schedule")
    public ResponseEntity<?> scheduleConsultation(
            @AuthenticationPrincipal User user,
            @PathVariable Long id,
            @RequestBody Map<String, String> body,
            HttpServletRequest request) {

        LawyerProfile lawyerProfile = getAuthenticatedLawyerProfile(user);
        if (lawyerProfile == null) {
            return ResponseEntity.status(403).body("Access Denied");
        }

        Optional<Consultation> consultationOpt = consultationRepository.findByIdAndLawyerId(id, lawyerProfile.getId());
        if (consultationOpt.isEmpty()) {
            return ResponseEntity.status(403).body("Forbidden: You do not have permission to modify this consultation.");
        }

        Consultation consultation = consultationOpt.get();
        String oldStatus = consultation.getStatus();

        if (body.containsKey("scheduledAt")) {
            try {
                consultation.setScheduledAt(LocalDateTime.parse(body.get("scheduledAt")));
            } catch (Exception ignored) {}
        }
        if (body.containsKey("durationMinutes")) {
            try {
                int duration = Integer.parseInt(body.get("durationMinutes"));
                consultation.setDurationMinutes(duration);
                // Re-calculate total amount based on ratePerMinute snapshot
                if (consultation.getRatePerMinute() != null) {
                    consultation.setTotalAmount(consultation.getRatePerMinute() * duration);
                    consultation.setPrice(consultation.getTotalAmount());
                }
            } catch (Exception ignored) {}
        }

        consultation.setStatus("SCHEDULED");
        Consultation updated = consultationRepository.save(consultation);

        // 3. Status History Tracking
        statusHistoryRepository.save(new ConsultationStatusHistory(updated, oldStatus, "SCHEDULED", user.getClerkUserId()));

        // 5. Audit Log
        auditLogRepository.save(new AuditLog(user.getClerkUserId(), "LAWYER_SCHEDULE_CONSULTATION", "Consultation", updated.getId(), request.getRemoteAddr()));

        return ResponseEntity.ok(ConsultationResponseDto.fromEntity(updated, true));
    }

    @PatchMapping("/consultations/{id}/meet-link")
    public ResponseEntity<?> setMeetLink(
            @AuthenticationPrincipal User user,
            @PathVariable Long id,
            @RequestBody Map<String, String> body,
            HttpServletRequest request) {

        LawyerProfile lawyerProfile = getAuthenticatedLawyerProfile(user);
        if (lawyerProfile == null) {
            return ResponseEntity.status(403).body("Access Denied");
        }

        Optional<Consultation> consultationOpt = consultationRepository.findByIdAndLawyerId(id, lawyerProfile.getId());
        if (consultationOpt.isEmpty()) {
            return ResponseEntity.status(403).body("Forbidden: You do not have permission to modify this consultation.");
        }

        Consultation consultation = consultationOpt.get();
        String oldStatus = consultation.getStatus();
        String meetLink = body.get("meetLink");
        String provider = body.getOrDefault("provider", "GOOGLE_MEET");

        if (meetLink != null && !meetLink.isBlank()) {
            consultation.setMeetLink(meetLink);
            consultation.setStatus("READY");

            // 2. Separate Meeting Table Record creation
            ConsultationMeeting meeting = new ConsultationMeeting();
            meeting.setConsultation(consultation);
            meeting.setMeetingProvider(provider);
            meeting.setMeetingLink(meetLink);
            meeting.setCreatedBy(user.getClerkUserId());
            meetingRepository.save(meeting);
        }

        Consultation updated = consultationRepository.save(consultation);

        // 3. Status History Tracking
        statusHistoryRepository.save(new ConsultationStatusHistory(updated, oldStatus, "READY", user.getClerkUserId()));

        // 5. Audit Log
        auditLogRepository.save(new AuditLog(user.getClerkUserId(), "LAWYER_ADD_MEETING_LINK", "Consultation", updated.getId(), request.getRemoteAddr()));

        // 6. Notification to User
        if (updated.getUser() != null) {
            notificationRepository.save(new Notification(updated.getUser(), "Meeting Link Added", "Your video consultation link is ready. Join on schedule!", "MEETING_READY"));
        }

        return ResponseEntity.ok(ConsultationResponseDto.fromEntity(updated, true));
    }
}
