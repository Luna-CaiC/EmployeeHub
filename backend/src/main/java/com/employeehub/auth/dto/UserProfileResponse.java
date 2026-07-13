package com.employeehub.auth.dto;

import java.time.LocalDateTime;

public record UserProfileResponse(
        Long id,
        String username,
        String role,
        boolean enabled,
        LocalDateTime createdAt
) {
}
