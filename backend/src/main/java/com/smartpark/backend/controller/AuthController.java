package com.smartpark.backend.controller;

import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
@CrossOrigin("*")
public class AuthController {

    @PostMapping("/login")
    public Map<String, String> login(@RequestBody Map<String, String> user) {

        String username = user.get("username");
        String password = user.get("password");

        Map<String, String> response = new HashMap<>();

        // SIMPLE HARDCODED LOGIN (for project)
        if (username.equals("admin") && password.equals("admin123")) {
            response.put("status", "success");
            response.put("role", "ADMIN");
        }
        else if (username.equals("user") && password.equals("user123")) {
            response.put("status", "success");
            response.put("role", "USER");
        }
        else {
            response.put("status", "fail");
        }

        return response;
    }
}