package com.employeehub.auth.controller;

import com.employeehub.auth.dto.ChangePasswordRequest;
import com.employeehub.auth.dto.LoginRequest;
import com.employeehub.auth.dto.LoginResponse;
import com.employeehub.auth.dto.MessageResponse;
import com.employeehub.auth.dto.ProfileUpdateRequest;
import com.employeehub.auth.dto.UserProfileResponse;
import com.employeehub.auth.service.AuthenticationService;
import com.employeehub.auth.service.UserService;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
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

    @PutMapping("/profile")
    public UserProfileResponse updateProfile(
            Authentication authentication,
            @Valid @RequestBody ProfileUpdateRequest request
    ) {
        return userService.updateCurrentUserProfile(authentication.getName(), request);
    }

    @PutMapping("/profile/password")
    public MessageResponse changePassword(
            Authentication authentication,
            @Valid @RequestBody ChangePasswordRequest request
    ) {
        return userService.changeCurrentUserPassword(authentication.getName(), request);
    }
}
