package com.nyaysetu.backend.controller;

import com.nyaysetu.backend.dto.UserDto;
import com.nyaysetu.backend.model.User;
import com.nyaysetu.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/me")
@CrossOrigin(origins = "*")
public class MeController {

    @Autowired
    private UserService userService;

    @GetMapping
    public ResponseEntity<UserDto> getCurrentUser(
            @AuthenticationPrincipal Object principal,
            @RequestParam(required = false) String email,
            @RequestParam(required = false) String name) {
        if (!(principal instanceof User user)) {
            return ResponseEntity.status(401).build();
        }
        if ((email != null && !email.isBlank()) || (name != null && !name.isBlank())) {
            user = userService.syncClientProfile(user, email, name);
        } else {
            user = userService.syncClientProfile(user, user.getEmail(), user.getFullName());
        }
        UserDto dto = userService.getUserDto(user);
        return ResponseEntity.ok(dto);
    }

    @PostMapping("/sync")
    public ResponseEntity<UserDto> syncUser(
            @AuthenticationPrincipal Object principal,
            @RequestBody(required = false) Map<String, String> body) {
        if (!(principal instanceof User user)) {
            return ResponseEntity.status(401).build();
        }
        String email = body != null ? body.get("email") : null;
        String name = body != null ? body.get("name") : null;

        User updatedUser = userService.syncClientProfile(user, email, name);
        return ResponseEntity.ok(userService.getUserDto(updatedUser));
    }
}
