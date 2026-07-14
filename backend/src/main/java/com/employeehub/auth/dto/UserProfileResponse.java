package com.employeehub.auth.dto;

import java.time.LocalDateTime;

public record UserProfileResponse(
        Long id,
        String username,
        String role,
        boolean enabled,
        String name,
        String email,
        String phone,
        String department,
        LocalDateTime createdAt
) {
}
