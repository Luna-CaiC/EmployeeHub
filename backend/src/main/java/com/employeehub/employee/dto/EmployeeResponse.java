package com.employeehub.employee.dto;

import com.employeehub.employee.entity.EmployeeStatus;
import com.employeehub.employee.entity.EmploymentType;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public record EmployeeResponse(
        Long id,
        String employeeCode,
        String firstName,
        String lastName,
        String email,
        String phone,
        Long departmentId,
        String departmentName,
        String jobTitle,
        EmploymentType employmentType,
        BigDecimal salary,
        LocalDate hireDate,
        EmployeeStatus status,
        String profileImage,
        String createdBy,
        LocalDateTime createdAt,
        String updatedBy,
        LocalDateTime updatedAt
) {
}
