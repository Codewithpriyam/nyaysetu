package com.nyaysetu.backend.controller;

import com.nyaysetu.backend.model.Advocate;
import com.nyaysetu.backend.repository.AdvocateRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/lawyers")
@CrossOrigin(origins = "*")
public class AdvocateController {

    @Autowired
    private AdvocateRepository advocateRepository;

    @GetMapping("/search")
    public List<Advocate> searchAdvocates(
            @RequestParam(required = false, defaultValue = "Jharkhand") String state,
            @RequestParam(required = false, defaultValue = "Ranchi") String district) {
        
        List<Advocate> results = advocateRepository.findByStateContainingIgnoreCaseAndDistrictContainingIgnoreCase(state, district);
        if (results.isEmpty()) {
            results = advocateRepository.findByStateContainingIgnoreCase(state);
        }
        return results;
    }

    @GetMapping("/stats")
    public Map<String, Object> getAdvocateStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalAdvocates", advocateRepository.count());
        stats.put("status", "UP");
        stats.put("service", "NyayaSetu Real Advocates Database API");
        return stats;
    }

    @PostMapping
    public Advocate createAdvocate(@RequestBody Advocate advocate) {
        return advocateRepository.save(advocate);
    }
}
