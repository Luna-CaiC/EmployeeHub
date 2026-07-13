package com.employeehub.security;

import com.employeehub.exception.ApiErrorResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

@Component
public class RestAuthenticationEntryPoint implements AuthenticationEntryPoint {

    private final ObjectMapper objectMapper;

    public RestAuthenticationEntryPoint(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    @Override
    public void commence(
            HttpServletRequest request,
            HttpServletResponse response,
            AuthenticationException authException
    ) throws IOException {
        String message = getMessage(request, authException);
        ApiErrorResponse errorResponse = ApiErrorResponse.of(HttpStatus.UNAUTHORIZED, message, request.getRequestURI());

        response.setStatus(HttpStatus.UNAUTHORIZED.value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        objectMapper.writeValue(response.getWriter(), errorResponse);
    }

    private String getMessage(HttpServletRequest request, AuthenticationException authException) {
        Object authError = request.getAttribute("authError");
        if (authError instanceof String message && !message.isBlank()) {
            return message;
        }
        String authorizationHeader = request.getHeader("Authorization");
        if (authorizationHeader == null || authorizationHeader.isBlank()) {
            return "Missing JWT";
        }
        String exceptionMessage = authException.getMessage();
        if (exceptionMessage == null || exceptionMessage.isBlank()) {
            return "Authentication is required";
        }
        return exceptionMessage;
    }
}
