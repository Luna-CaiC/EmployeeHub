package com.employeehub.employee.dto;

import com.employeehub.employee.entity.EmployeeStatus;
import com.employeehub.employee.entity.EmploymentType;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.time.LocalDate;

public record EmployeeRequest(
        @NotBlank(message = "Employee code is required")
        @Size(max = 50, message = "Employee code must be at most 50 characters")
        String employeeCode,

        @NotBlank(message = "First name is required")
        @Size(max = 100, message = "First name must be at most 100 characters")
        String firstName,

        @NotBlank(message = "Last name is required")
        @Size(max = 100, message = "Last name must be at most 100 characters")
        String lastName,

        @NotBlank(message = "Email is required")
        @Email(message = "Email must be valid")
        @Size(max = 150, message = "Email must be at most 150 characters")
        String email,

        @Size(max = 30, message = "Phone must be at most 30 characters")
        String phone,

        @NotNull(message = "Department is required")
        Long departmentId,

        @NotBlank(message = "Job title is required")
        @Size(max = 120, message = "Job title must be at most 120 characters")
        String jobTitle,

        @NotNull(message = "Employment type is required")
        EmploymentType employmentType,

        @NotNull(message = "Salary is required")
        @DecimalMin(value = "0.0", inclusive = false, message = "Salary must be greater than 0")
        BigDecimal salary,

        @NotNull(message = "Hire date is required")
        LocalDate hireDate,

        EmployeeStatus status,

        @Size(max = 500, message = "Profile image URL must be at most 500 characters")
        String profileImage
) {
}
