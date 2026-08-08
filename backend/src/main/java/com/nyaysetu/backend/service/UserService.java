package com.nyaysetu.backend.service;

import com.nyaysetu.backend.dto.UserDto;
import com.nyaysetu.backend.model.Role;
import com.nyaysetu.backend.model.User;
import com.nyaysetu.backend.repository.LawyerProfileRepository;
import com.nyaysetu.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private LawyerProfileRepository lawyerProfileRepository;

    @Value("${admin.email:priyamsingh504@gmail.com}")
    private String adminEmail;

    @Transactional
    public User getOrCreateUser(String clerkUserId, String email, String fullName) {
        Optional<User> existingOpt = userRepository.findByClerkUserId(clerkUserId);
        if (existingOpt.isEmpty() && clerkUserId != null) {
            existingOpt = userRepository.findAll().stream()
                    .filter(u -> u.getClerkUserId() != null && u.getClerkUserId().equalsIgnoreCase(clerkUserId.trim()))
                    .findFirst();
        }
        if (existingOpt.isEmpty() && email != null && !email.isBlank()) {
            existingOpt = userRepository.findByEmail(email.trim());
        }

        boolean isBootstrapAdmin = (email != null && email.equalsIgnoreCase(adminEmail.trim()))
                || (clerkUserId != null && clerkUserId.equalsIgnoreCase("user_3HbuiMTxSZfafPLIbNPEvHKtl70"))
                || (email != null && email.toLowerCase().contains("priyamsingh504"));

        if (existingOpt.isPresent()) {
            User user = existingOpt.get();
            boolean updated = false;
            if (clerkUserId != null && !clerkUserId.equalsIgnoreCase(user.getClerkUserId())) {
                user.setClerkUserId(clerkUserId);
                updated = true;
            }
            if (email != null && !email.isBlank() && !email.equals(user.getEmail())) {
                user.setEmail(email);
                updated = true;
            }
            if (fullName != null && !fullName.isBlank() && !fullName.equals(user.getFullName())) {
                user.setFullName(fullName);
                updated = true;
            }
            if (isBootstrapAdmin && user.getRole() != Role.ADMIN) {
                user.setRole(Role.ADMIN);
                updated = true;
            }
            checkAndAutoLinkLawyer(user);
            if (updated) {
                user = userRepository.save(user);
            }
            return user;
        }

        // New registration synchronization
        User newUser = new User();
        newUser.setClerkUserId(clerkUserId);
        newUser.setEmail(email != null && !email.isBlank() ? email : clerkUserId + "@clerk.user");
        newUser.setFullName(fullName != null && !fullName.isBlank() ? fullName : "Citizen User");

        if (isBootstrapAdmin) {
            newUser.setRole(Role.ADMIN);
        } else {
            newUser.setRole(Role.USER);
        }

        User savedUser = userRepository.save(newUser);
        checkAndAutoLinkLawyer(savedUser);
        return savedUser;
    }

    @Transactional
    public User syncClientProfile(User user, String clientEmail, String clientName) {
        boolean updated = false;
        if (clientEmail != null && !clientEmail.isBlank() && !clientEmail.equals(user.getEmail())) {
            user.setEmail(clientEmail.trim());
            updated = true;
        }
        if (clientName != null && !clientName.isBlank() && !clientName.equals(user.getFullName())) {
            user.setFullName(clientName.trim());
            updated = true;
        }

        boolean isBootstrapAdmin = (user.getEmail() != null && user.getEmail().equalsIgnoreCase(adminEmail.trim()))
                || (clientEmail != null && clientEmail.equalsIgnoreCase(adminEmail.trim()))
                || (user.getClerkUserId() != null && user.getClerkUserId().equalsIgnoreCase("user_3HbuiMTxSZfafPLIbNPEvHKtl70"))
                || (user.getEmail() != null && user.getEmail().toLowerCase().contains("priyamsingh504"))
                || (clientEmail != null && clientEmail.toLowerCase().contains("priyamsingh504"));

        if (isBootstrapAdmin && user.getRole() != Role.ADMIN) {
            user.setRole(Role.ADMIN);
            updated = true;
        }

        checkAndAutoLinkLawyer(user);

        if (updated) {
            user = userRepository.save(user);
        }
        return user;
    }

    private void checkAndAutoLinkLawyer(User user) {
        if (user == null || user.getEmail() == null || user.getRole() == Role.ADMIN) return;

        String lowerEmail = user.getEmail().toLowerCase().trim();

        if (lowerEmail.contains("prince")) {
            if (user.getRole() != Role.LAWYER) {
                user.setRole(Role.LAWYER);
                userRepository.save(user);
            }
            lawyerProfileRepository.findBySlug("prince-kumar").ifPresent(lp -> {
                if (lp.getUser() == null || !lp.getUser().getId().equals(user.getId())) {
                    lp.setUser(user);
                    lawyerProfileRepository.save(lp);
                }
            });
        } else if (lowerEmail.contains("shruti")) {
            if (user.getRole() != Role.LAWYER) {
                user.setRole(Role.LAWYER);
                userRepository.save(user);
            }
            lawyerProfileRepository.findBySlug("shruti").ifPresent(lp -> {
                if (lp.getUser() == null || !lp.getUser().getId().equals(user.getId())) {
                    lp.setUser(user);
                    lawyerProfileRepository.save(lp);
                }
            });
        }
    }

    public UserDto getUserDto(User user) {
        UserDto dto = new UserDto();
        dto.setId(user.getId());
        dto.setClerkUserId(user.getClerkUserId());
        dto.setEmail(user.getEmail());
        dto.setFullName(user.getFullName());
        dto.setRole(user.getRole() != null ? user.getRole().name() : "USER");

        if (user.getRole() == Role.LAWYER) {
            lawyerProfileRepository.findByUserId(user.getId()).ifPresent(lp -> {
                dto.setLawyerProfileId(lp.getId());
            });
        }
        return dto;
    }
}
