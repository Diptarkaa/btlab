package com.bankapp.controller;

import com.bankapp.dto.JwtResponse;
import com.bankapp.dto.LoginRequest;
import com.bankapp.dto.MessageResponse;
import com.bankapp.dto.RegisterRequest;
import com.bankapp.entity.User;
import com.bankapp.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/auth")
@Tag(name = "Authentication", description = "Authentication management APIs")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    @Operation(summary = "Register a new user", description = "Register a new user account for banking services")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "User registered successfully"),
        @ApiResponse(responseCode = "400", description = "Bad request - validation error or user already exists"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequest registerRequest) {
        try {
            User user = authService.registerUser(registerRequest);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new MessageResponse("User registered successfully! Welcome to SecureBank, " + 
                                            user.getFirstName() + "!"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new MessageResponse("Registration failed: " + e.getMessage()));
        }
    }

    @PostMapping("/login")
    @Operation(summary = "User login", description = "Authenticate user and return JWT token")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Login successful"),
        @ApiResponse(responseCode = "401", description = "Invalid credentials"),
        @ApiResponse(responseCode = "400", description = "Bad request - validation error")
    })
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            JwtResponse jwtResponse = authService.authenticateUser(loginRequest);
            return ResponseEntity.ok(jwtResponse);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new MessageResponse("Login failed: Invalid email or password"));
        }
    }

    @GetMapping("/check-email/{email}")
    @Operation(summary = "Check email availability", description = "Check if email is already registered")
    public ResponseEntity<?> checkEmailAvailability(@PathVariable String email) {
        boolean exists = authService.existsByEmail(email);
        return ResponseEntity.ok(new MessageResponse(exists ? "Email is already taken" : "Email is available"));
    }

    @GetMapping("/check-mobile/{mobile}")
    @Operation(summary = "Check mobile availability", description = "Check if mobile number is already registered")
    public ResponseEntity<?> checkMobileAvailability(@PathVariable String mobile) {
        boolean exists = authService.existsByMobile(mobile);
        return ResponseEntity.ok(new MessageResponse(exists ? "Mobile number is already taken" : "Mobile number is available"));
    }

    @GetMapping("/check-pan/{pan}")
    @Operation(summary = "Check PAN availability", description = "Check if PAN is already registered")
    public ResponseEntity<?> checkPanAvailability(@PathVariable String pan) {
        boolean exists = authService.existsByPan(pan.toUpperCase());
        return ResponseEntity.ok(new MessageResponse(exists ? "PAN is already registered" : "PAN is available"));
    }
}