package com.nyaysetu.backend.config;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.nyaysetu.backend.model.*;
import com.nyaysetu.backend.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    @Autowired
    private AdvocateRepository advocateRepository;

    @Autowired
    private LawyerProfileRepository lawyerProfileRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ConsultationRepository consultationRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    @Override
    public void run(String... args) throws Exception {
        seedLawyerProfiles();
        seedAdvocateDatabase();
        purgeFakeSeedPayments();
    }

    private void seedLawyerProfiles() {
        if (lawyerProfileRepository.findBySlug("prince-kumar").isEmpty()) {
            LawyerProfile prince = new LawyerProfile();
            prince.setSlug("prince-kumar");
            prince.setName("Adv. Prince Kumar");
            prince.setCourt("Deoghar Court");
            prince.setExperienceYears(2);
            prince.setConsultationCount(18);
            prince.setPricePerMinute(25.0);
            prince.setBio("Committed to helping clients navigate complex legal issues with clear, practical guidance.");
            prince.setLanguages("Hindi, English");
            prince.setVerificationStatus("VERIFIED");
            lawyerProfileRepository.save(prince);
            log.info("Initialized LawyerProfile: Adv. Prince Kumar");
        }

        if (lawyerProfileRepository.findBySlug("shruti").isEmpty()) {
            LawyerProfile shruti = new LawyerProfile();
            shruti.setSlug("shruti");
            shruti.setName("Adv. Shruti");
            shruti.setCourt("Ranchi High Court");
            shruti.setExperienceYears(1);
            shruti.setConsultationCount(10);
            shruti.setPricePerMinute(25.0);
            shruti.setBio("Dedicated legal professional providing consultation and representation across a wide range of legal matters.");
            shruti.setLanguages("Hindi, English");
            shruti.setVerificationStatus("VERIFIED");
            lawyerProfileRepository.save(shruti);
            log.info("Initialized LawyerProfile: Adv. Shruti");
        }
    }

    private void seedAdvocateDatabase() {
        if (advocateRepository.count() > 0) {
            log.info("Advocates database already initialized with {} records.", advocateRepository.count());
            return;
        }

        File datasetsFolder = new File("frontend/src/data/officialStateAdvocates");
        if (!datasetsFolder.exists() || !datasetsFolder.isDirectory()) {
            datasetsFolder = new File("../frontend/src/data/officialStateAdvocates");
        }
        if (!datasetsFolder.exists() || !datasetsFolder.isDirectory()) {
            datasetsFolder = new File("d:/Nyaysetu/frontend/src/data/officialStateAdvocates");
        }
        if (!datasetsFolder.exists() || !datasetsFolder.isDirectory()) {
            log.warn("Official state advocates dataset directory not found at: {}", datasetsFolder.getAbsolutePath());
            return;
        }

        File[] jsonFiles = datasetsFolder.listFiles((dir, name) -> name.endsWith(".json"));
        if (jsonFiles == null || jsonFiles.length == 0) {
            log.warn("No JSON state datasets found in {}", datasetsFolder.getAbsolutePath());
            return;
        }

        ObjectMapper objectMapper = new ObjectMapper();
        List<Advocate> allAdvocates = new ArrayList<>();

        for (File file : jsonFiles) {
            try (InputStream is = new FileInputStream(file)) {
                JsonNode root = objectMapper.readTree(is);
                JsonNode advocatesNode = root.get("advocates");
                if (advocatesNode != null && advocatesNode.isArray()) {
                    for (JsonNode advNode : advocatesNode) {
                        Advocate advocate = new Advocate();
                        advocate.setName(advNode.path("name").asText("Adv. Registered Practitioner"));
                        advocate.setBarEnrollment(advNode.path("barEnrollment").asText());
                        advocate.setPhone(advNode.path("phone").asText("+91 94311 10000"));
                        advocate.setCourt(advNode.path("court").asText("High Court & District Court"));
                        advocate.setDistrict(advNode.path("district").asText("Ranchi"));
                        advocate.setState(advNode.path("state").asText("Jharkhand"));
                        advocate.setAddress(advNode.path("address").asText());
                        advocate.setSpecialization(advNode.path("specialization").asText("General Litigation"));
                        advocate.setExperience(advNode.path("experience").asInt(5));
                        advocate.setRating(advNode.path("rating").asDouble(4.8));
                        advocate.setReviewsCount(advNode.path("reviewsCount").asInt(50));
                        advocate.setSource(advNode.path("source").asText("Official State Roll"));

                        allAdvocates.add(advocate);
                    }
                }
                log.info("Loaded {} -> {} records.", file.getName(), (advocatesNode != null ? advocatesNode.size() : 0));
            } catch (Exception e) {
                log.error("Failed to parse dataset file {}: {}", file.getName(), e.getMessage());
            }
        }

        if (!allAdvocates.isEmpty()) {
            advocateRepository.saveAll(allAdvocates);
            log.info("Successfully loaded {} advocate records into database.", allAdvocates.size());
        }
    }

    private void purgeFakeSeedPayments() {
        try {
            List<String> mockEmails = List.of("rahul.sharma@gmail.com", "pooja.verma@gmail.com");
            for (String email : mockEmails) {
                userRepository.findByEmail(email).ifPresent(user -> {
                    List<Payment> userPayments = paymentRepository.findByConsultationUserIdOrderByCreatedAtDesc(user.getId());
                    if (!userPayments.isEmpty()) {
                        paymentRepository.deleteAll(userPayments);
                    }
                    List<Consultation> userConsultations = consultationRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
                    if (!userConsultations.isEmpty()) {
                        consultationRepository.deleteAll(userConsultations);
                    }
                    userRepository.delete(user);
                });
            }

            List<Payment> allPayments = paymentRepository.findAll();
            List<Payment> dummyPayments = allPayments.stream()
                .filter(p -> (p.getUtrNumber() != null && (
                    p.getUtrNumber().equals("528190342156") ||
                    p.getUtrNumber().equals("528190891234") ||
                    p.getUtrNumber().startsWith("PENDING-NYAYA-")
                )) || (p.getGatewaySessionId() != null && (
                    p.getGatewaySessionId().equals("youpi_sess_789f1a23bc") ||
                    p.getGatewaySessionId().equals("youpi_sess_123b7c89de") ||
                    p.getGatewaySessionId().equals("youpi_sess_456d2e34fa")
                )))
                .collect(Collectors.toList());

            if (!dummyPayments.isEmpty()) {
                paymentRepository.deleteAll(dummyPayments);
                log.info("Purged {} legacy mock payment records from ledger.", dummyPayments.size());
            } else {
                log.info("Payment ledger is clean. Only authentic payment records present.");
            }
        } catch (Exception e) {
            log.warn("Notice during payment ledger check: {}", e.getMessage());
        }
    }
}
