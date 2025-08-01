package com.bankapp.service;

import com.bankapp.dto.JwtResponse;
import com.bankapp.dto.LoginRequest;
import com.bankapp.dto.RegisterRequest;
import com.bankapp.entity.Role;
import com.bankapp.entity.User;
import com.bankapp.repository.UserRepository;
import com.bankapp.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    public User registerUser(RegisterRequest registerRequest) {
        // Check if user already exists
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new RuntimeException("Error: Email is already in use!");
        }

        if (userRepository.existsByMobile(registerRequest.getMobile())) {
            throw new RuntimeException("Error: Mobile number is already in use!");
        }

        if (userRepository.existsByPan(registerRequest.getPan())) {
            throw new RuntimeException("Error: PAN is already in use!");
        }

        // Create new user
        User user = new User();
        user.setFirstName(registerRequest.getFirstName());
        user.setLastName(registerRequest.getLastName());
        user.setEmail(registerRequest.getEmail());
        user.setMobile(registerRequest.getMobile());
        user.setPan(registerRequest.getPan().toUpperCase());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        user.setEntityType(registerRequest.getEntityType());
        user.setPincode(registerRequest.getPincode());
        user.setBranch(registerRequest.getBranch());
        user.setRole(Role.USER);

        return userRepository.save(user);
    }

    public JwtResponse authenticateUser(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getEmail(),
                        loginRequest.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtTokenProvider.generateToken(authentication);

        User user = (User) authentication.getPrincipal();

        return new JwtResponse(jwt, user.getId(), user.getEmail(), 
                              user.getFirstName(), user.getLastName(), user.getRole());
    }

    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    public boolean existsByMobile(String mobile) {
        return userRepository.existsByMobile(mobile);
    }

    public boolean existsByPan(String pan) {
        return userRepository.existsByPan(pan);
    }
}