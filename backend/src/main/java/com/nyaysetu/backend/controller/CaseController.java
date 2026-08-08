package com.nyaysetu.backend.controller;

import com.nyaysetu.backend.dto.CaseDocumentDto;
import com.nyaysetu.backend.dto.CaseDto;
import com.nyaysetu.backend.dto.CaseHearingDto;
import com.nyaysetu.backend.model.*;
import com.nyaysetu.backend.repository.*;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1")
@CrossOrigin(origins = "*")
public class CaseController {

    @Autowired
    private CaseRepository caseRepository;

    @Autowired
    private CaseHearingRepository hearingRepository;

    @Autowired
    private CaseDocumentRepository documentRepository;

    @Autowired
    private LawyerProfileRepository lawyerProfileRepository;

    @Autowired
    private AuditLogRepository auditLogRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    // ─── Citizen Create Case ────────────────────────────────────────────────
    @PostMapping("/cases")
    public ResponseEntity<?> createCase(
            @AuthenticationPrincipal Object principal,
            @RequestBody Map<String, String> body) {

        if (!(principal instanceof User user)) return ResponseEntity.status(401).body("Unauthenticated");

        String title = body.get("title");
        if (title == null || title.isBlank()) {
            return ResponseEntity.badRequest().body("Title is required");
        }

        LegalCase legalCase = new LegalCase();
        legalCase.setUser(user);
        legalCase.setTitle(title);
        legalCase.setDescription(body.get("description"));
        legalCase.setCategory(body.getOrDefault("category", "Civil Litigation"));
        legalCase.setCourtName(body.getOrDefault("courtName", "District Court"));
        legalCase.setPriority(body.getOrDefault("priority", "MEDIUM"));
        legalCase.setStatus("ACTIVE");

        // Unique Case Number generation (e.g. CC/PAT/2026/UUID)
        String caseNumber = "CC/NS/" + LocalDate.now().getYear() + "/" + UUID.randomUUID().toString().substring(0, 6).toUpperCase();
        legalCase.setCaseNumber(caseNumber);

        if (body.containsKey("lawyerId") && !body.get("lawyerId").isBlank()) {
            try {
                Long lawyerId = Long.parseLong(body.get("lawyerId"));
                lawyerProfileRepository.findById(lawyerId).ifPresent(legalCase::setLawyer);
            } catch (Exception ignored) {}
        }

        LegalCase saved = caseRepository.save(legalCase);

        // Record Initial Case Created Hearing Step
        CaseHearing hearing = new CaseHearing();
        hearing.setLegalCase(saved);
        hearing.setHearingDate(LocalDate.now());
        hearing.setCourtName(saved.getCourtName());
        hearing.setRemarks("Case filed and registered in NyayaSetu Portal.");
        hearing.setStatus("COMPLETED");
        hearingRepository.save(hearing);

        return ResponseEntity.ok(CaseDto.fromEntity(saved));
    }

    // ─── Citizen Get My Cases ───────────────────────────────────────────────
    @GetMapping("/me/cases")
    public ResponseEntity<?> getMyCases(@AuthenticationPrincipal Object principal) {
        if (!(principal instanceof User user)) return ResponseEntity.status(401).build();

        List<LegalCase> cases = caseRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
        List<CaseDto> dtos = cases.stream().map(c -> {
            CaseDto dto = CaseDto.fromEntity(c);
            List<CaseHearing> hearings = hearingRepository.findByLegalCaseIdOrderByHearingDateAsc(c.getId());
            dto.setHearings(hearings.stream().map(CaseHearingDto::fromEntity).collect(Collectors.toList()));
            return dto;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(dtos);
    }

    // ─── Get Case Detail (Citizen or Lawyer Owner) ─────────────────────────
    @GetMapping("/cases/{id}")
    public ResponseEntity<?> getCaseDetail(
            @AuthenticationPrincipal Object principal,
            @PathVariable Long id) {

        if (!(principal instanceof User user)) return ResponseEntity.status(401).build();

        Optional<LegalCase> caseOpt = caseRepository.findById(id);
        if (caseOpt.isEmpty()) return ResponseEntity.notFound().build();

        LegalCase c = caseOpt.get();

        // OBJECT-LEVEL SECURITY: Check if user is case owner, assigned lawyer, or admin
        boolean isUserOwner = c.getUser() != null && c.getUser().getId().equals(user.getId());
        boolean isAssignedLawyer = c.getLawyer() != null && c.getLawyer().getUser() != null && c.getLawyer().getUser().getId().equals(user.getId());
        boolean isAdmin = user.getRole() == Role.ADMIN;

        if (!isUserOwner && !isAssignedLawyer && !isAdmin) {
            return ResponseEntity.status(403).body("Forbidden: You do not have permission to view this case.");
        }

        CaseDto dto = CaseDto.fromEntity(c);

        List<CaseHearing> hearings = hearingRepository.findByLegalCaseIdOrderByHearingDateAsc(c.getId());
        dto.setHearings(hearings.stream().map(CaseHearingDto::fromEntity).collect(Collectors.toList()));

        List<CaseDocument> docs = documentRepository.findByLegalCaseIdOrderByUploadedAtDesc(c.getId());
        dto.setDocuments(docs.stream().map(CaseDocumentDto::fromEntity).collect(Collectors.toList()));

        return ResponseEntity.ok(dto);
    }

    // ─── Add Document to Case ────────────────────────────────────────────────
    @PostMapping("/cases/{id}/documents")
    public ResponseEntity<?> addCaseDocument(
            @AuthenticationPrincipal Object principal,
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {

        if (!(principal instanceof User user)) return ResponseEntity.status(401).build();

        Optional<LegalCase> caseOpt = caseRepository.findById(id);
        if (caseOpt.isEmpty()) return ResponseEntity.notFound().build();

        LegalCase c = caseOpt.get();
        boolean isUserOwner = c.getUser() != null && c.getUser().getId().equals(user.getId());
        boolean isAssignedLawyer = c.getLawyer() != null && c.getLawyer().getUser() != null && c.getLawyer().getUser().getId().equals(user.getId());

        if (!isUserOwner && !isAssignedLawyer && user.getRole() != Role.ADMIN) {
            return ResponseEntity.status(403).body("Access Denied");
        }

        CaseDocument doc = new CaseDocument();
        doc.setLegalCase(c);
        doc.setUploadedBy(user);
        doc.setFileName(body.getOrDefault("fileName", "Document.pdf"));
        doc.setFilePath(body.getOrDefault("filePath", "/vault/documents/" + doc.getFileName()));
        doc.setDocumentType(body.getOrDefault("documentType", "EVIDENCE"));
        doc.setMimeType(body.getOrDefault("mimeType", "application/pdf"));

        CaseDocument saved = documentRepository.save(doc);
        return ResponseEntity.ok(CaseDocumentDto.fromEntity(saved));
    }

    // ─── Lawyer Assigned Cases ──────────────────────────────────────────────
    @GetMapping("/lawyer/cases")
    public ResponseEntity<?> getLawyerAssignedCases(@AuthenticationPrincipal User user) {
        if (user == null) return ResponseEntity.status(401).build();

        Optional<LawyerProfile> lawyerOpt = lawyerProfileRepository.findByUserId(user.getId());
        if (lawyerOpt.isEmpty()) {
            return ResponseEntity.status(403).body("User is not an assigned LawyerProfile");
        }

        // OBJECT-LEVEL SECURITY: Return only cases assigned to THIS lawyer
        List<LegalCase> cases = caseRepository.findByLawyerIdOrderByCreatedAtDesc(lawyerOpt.get().getId());
        List<CaseDto> dtos = cases.stream().map(c -> {
            CaseDto dto = CaseDto.fromEntity(c);
            List<CaseHearing> hearings = hearingRepository.findByLegalCaseIdOrderByHearingDateAsc(c.getId());
            dto.setHearings(hearings.stream().map(CaseHearingDto::fromEntity).collect(Collectors.toList()));
            return dto;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(dtos);
    }

    // ─── Lawyer Update Case Status ──────────────────────────────────────────
    @PatchMapping("/lawyer/cases/{id}/status")
    public ResponseEntity<?> updateCaseStatus(
            @AuthenticationPrincipal User user,
            @PathVariable Long id,
            @RequestBody Map<String, String> body,
            HttpServletRequest request) {

        if (user == null) return ResponseEntity.status(401).build();

        Optional<LawyerProfile> lawyerOpt = lawyerProfileRepository.findByUserId(user.getId());
        if (lawyerOpt.isEmpty()) return ResponseEntity.status(403).body("Access Denied");

        Optional<LegalCase> caseOpt = caseRepository.findByIdAndLawyerId(id, lawyerOpt.get().getId());
        if (caseOpt.isEmpty()) return ResponseEntity.status(403).body("Forbidden: Case not assigned to you.");

        LegalCase c = caseOpt.get();
        if (body.containsKey("status")) c.setStatus(body.get("status"));
        if (body.containsKey("priority")) c.setPriority(body.get("priority"));
        if (body.containsKey("nextHearingDate")) {
            try {
                c.setNextHearingDate(LocalDateTime.parse(body.get("nextHearingDate")));
            } catch (Exception ignored) {}
        }

        LegalCase updated = caseRepository.save(c);

        auditLogRepository.save(new AuditLog(user.getClerkUserId(), "LAWYER_UPDATE_CASE_STATUS", "LegalCase", updated.getId(), request.getRemoteAddr()));

        if (updated.getUser() != null) {
            notificationRepository.save(new Notification(updated.getUser(), "Case Status Updated", "Your case #" + updated.getCaseNumber() + " status is now " + updated.getStatus() + ".", "CASE_UPDATE"));
        }

        return ResponseEntity.ok(CaseDto.fromEntity(updated));
    }

    // ─── Lawyer Add Court Hearing ───────────────────────────────────────────
    @PostMapping("/lawyer/cases/{id}/hearings")
    public ResponseEntity<?> addCaseHearing(
            @AuthenticationPrincipal User user,
            @PathVariable Long id,
            @RequestBody Map<String, String> body,
            HttpServletRequest request) {

        if (user == null) return ResponseEntity.status(401).build();

        Optional<LawyerProfile> lawyerOpt = lawyerProfileRepository.findByUserId(user.getId());
        if (lawyerOpt.isEmpty()) return ResponseEntity.status(403).body("Access Denied");

        Optional<LegalCase> caseOpt = caseRepository.findByIdAndLawyerId(id, lawyerOpt.get().getId());
        if (caseOpt.isEmpty()) return ResponseEntity.status(403).body("Forbidden: Case not assigned to you.");

        LegalCase c = caseOpt.get();

        CaseHearing hearing = new CaseHearing();
        hearing.setLegalCase(c);
        hearing.setHearingDate(body.containsKey("hearingDate") ? LocalDate.parse(body.get("hearingDate")) : LocalDate.now());
        hearing.setHearingTime(body.getOrDefault("hearingTime", "10:30 AM"));
        hearing.setCourtName(body.getOrDefault("courtName", c.getCourtName()));
        hearing.setRemarks(body.get("remarks"));
        hearing.setStatus(body.getOrDefault("status", "SCHEDULED"));

        CaseHearing saved = hearingRepository.save(hearing);

        // Update case next_hearing_date
        c.setNextHearingDate(hearing.getHearingDate().atTime(10, 30));
        caseRepository.save(c);

        auditLogRepository.save(new AuditLog(user.getClerkUserId(), "LAWYER_ADD_HEARING", "CaseHearing", saved.getId(), request.getRemoteAddr()));

        if (c.getUser() != null) {
            notificationRepository.save(new Notification(c.getUser(), "New Court Hearing Scheduled", "Next hearing for case #" + c.getCaseNumber() + " set for " + hearing.getHearingDate() + ".", "HEARING_SCHEDULED"));
        }

        return ResponseEntity.ok(CaseHearingDto.fromEntity(saved));
    }
}
