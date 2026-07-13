package com.employeehub.auth.controller;

import com.employeehub.auth.dto.LoginRequest;
import com.employeehub.auth.dto.LoginResponse;
import com.employeehub.auth.dto.UserProfileResponse;
import com.employeehub.auth.service.AuthenticationService;
import com.employeehub.auth.service.UserService;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class UserController {

    private final AuthenticationService authenticationService;
    private final UserService userService;

    public UserController(AuthenticationService authenticationService, UserService userService) {
        this.authenticationService = authenticationService;
        this.userService = userService;
    }

    @PostMapping("/login")
    public LoginResponse login(@Valid @RequestBody LoginRequest request) {
        return authenticationService.login(request);
    }

    @GetMapping("/profile")
    public UserProfileResponse profile(Authentication authentication) {
        return userService.getCurrentUserProfile(authentication.getName());
    }
}
