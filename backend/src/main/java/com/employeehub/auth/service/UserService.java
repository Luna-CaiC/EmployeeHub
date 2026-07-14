package com.employeehub.auth.service;

import com.employeehub.auth.dto.ChangePasswordRequest;
import com.employeehub.auth.dto.MessageResponse;
import com.employeehub.auth.dto.ProfileUpdateRequest;
import com.employeehub.auth.dto.UserProfileResponse;
import com.employeehub.auth.entity.User;
import com.employeehub.auth.repository.UserRepository;
import com.employeehub.exception.InvalidRequestException;
import com.employeehub.exception.ResourceNotFoundException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Invalid username or password"));
        return UserPrincipal.from(user);
    }

    @Transactional(readOnly = true)
    public UserProfileResponse getCurrentUserProfile(String username) {
        return toProfileResponse(findByUsername(username));
    }

    @Transactional
    public UserProfileResponse updateCurrentUserProfile(String username, ProfileUpdateRequest request) {
        User user = findByUsername(username);
        user.updateProfile(
                normalizeRequiredText(request.name()),
                normalizeEmail(request.email()),
                normalizeOptionalText(request.phone()),
                normalizeOptionalText(request.department())
        );
        return toProfileResponse(user);
    }

    @Transactional
    public MessageResponse changeCurrentUserPassword(String username, ChangePasswordRequest request) {
        User user = findByUsername(username);
        if (!passwordEncoder.matches(request.currentPassword(), user.getPassword())) {
            throw new InvalidRequestException("Current password is incorrect");
        }
        if (!request.newPassword().equals(request.confirmPassword())) {
            throw new InvalidRequestException("Password confirmation does not match");
        }
        if (passwordEncoder.matches(request.newPassword(), user.getPassword())) {
            throw new InvalidRequestException("New password must be different from the current password");
        }
        user.changePassword(passwordEncoder.encode(request.newPassword()));
        return new MessageResponse("Password changed successfully");
    }

    private User findByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Authenticated user was not found"));
    }

    private UserProfileResponse toProfileResponse(User user) {
        return new UserProfileResponse(
                user.getId(),
                user.getUsername(),
                user.getRole().name(),
                user.isEnabled(),
                user.getName(),
                user.getEmail(),
                user.getPhone(),
                user.getDepartment(),
                user.getCreatedAt()
        );
    }

    private String normalizeRequiredText(String value) {
        return value == null ? null : value.trim();
    }

    private String normalizeOptionalText(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        return value.trim();
    }

    private String normalizeEmail(String email) {
        String normalizedEmail = normalizeRequiredText(email);
        return normalizedEmail == null ? null : normalizedEmail.toLowerCase();
    }
}
