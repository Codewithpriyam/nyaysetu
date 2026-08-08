package com.nyaysetu.backend.config;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.nyaysetu.backend.model.Advocate;
import com.nyaysetu.backend.model.LawyerProfile;
import com.nyaysetu.backend.repository.AdvocateRepository;
import com.nyaysetu.backend.repository.LawyerProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private AdvocateRepository advocateRepository;

    @Autowired
    private LawyerProfileRepository lawyerProfileRepository;

    @Override
    public void run(String... args) throws Exception {
        seedLawyerProfiles();
        seedAdvocateDatabase();
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
            System.out.println(">>> Initialized LawyerProfile: Adv. Prince Kumar");
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
            System.out.println(">>> Initialized LawyerProfile: Adv. Shruti");
        }
    }

    private void seedAdvocateDatabase() {
        System.out.println(">>> NyayaSetu DataInitializer: Checking Advocates Database...");

        if (advocateRepository.count() > 0) {
            System.out.println(">>> Database already initialized with " + advocateRepository.count() + " advocate records.");
            return;
        }

        File datasetsFolder = new File("d:/Nyaysetu/frontend/src/data/officialStateAdvocates");
        if (!datasetsFolder.exists() || !datasetsFolder.isDirectory()) {
            System.out.println(">>> Datasets directory not found at " + datasetsFolder.getAbsolutePath());
            return;
        }

        File[] jsonFiles = datasetsFolder.listFiles((dir, name) -> name.endsWith(".json"));
        if (jsonFiles == null || jsonFiles.length == 0) {
            System.out.println(">>> No JSON state datasets found.");
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
                System.out.println("Loaded " + file.getName() + " -> " + (advocatesNode != null ? advocatesNode.size() : 0) + " records.");
            } catch (Exception e) {
                System.err.println("Failed to parse dataset file: " + file.getName() + " -> " + e.getMessage());
            }
        }

        if (!allAdvocates.isEmpty()) {
            advocateRepository.saveAll(allAdvocates);
            System.out.println("==========================================================================");
            System.out.println(" SUCCESS: Loaded " + allAdvocates.size() + " REAL Advocate Records into Spring Boot Database!");
            System.out.println("==========================================================================");
        }
    }
}
