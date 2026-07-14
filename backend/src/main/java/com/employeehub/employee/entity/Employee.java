package com.employeehub.employee.entity;

import com.employeehub.department.entity.Department;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(
        name = "employees",
        uniqueConstraints = {
                @UniqueConstraint(name = "uk_employees_employee_code", columnNames = "employee_code"),
                @UniqueConstraint(name = "uk_employees_email", columnNames = "email")
        }
)
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Employee code is required")
    @Size(max = 50, message = "Employee code must be at most 50 characters")
    @Column(name = "employee_code", nullable = false, unique = true, length = 50)
    private String employeeCode;

    @NotBlank(message = "First name is required")
    @Size(max = 100, message = "First name must be at most 100 characters")
    @Column(nullable = false, length = 100)
    private String firstName;

    @NotBlank(message = "Last name is required")
    @Size(max = 100, message = "Last name must be at most 100 characters")
    @Column(nullable = false, length = 100)
    private String lastName;

    @NotBlank(message = "Email is required")
    @Email(message = "Email must be valid")
    @Size(max = 150, message = "Email must be at most 150 characters")
    @Column(nullable = false, unique = true, length = 150)
    private String email;

    @Size(max = 30, message = "Phone must be at most 30 characters")
    @Column(length = 30)
    private String phone;

    @NotNull(message = "Department is required")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "department_id", nullable = false)
    private Department department;

    @NotBlank(message = "Job title is required")
    @Size(max = 120, message = "Job title must be at most 120 characters")
    @Column(nullable = false, length = 120)
    private String jobTitle;

    @NotNull(message = "Employment type is required")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private EmploymentType employmentType;

    @NotNull(message = "Salary is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Salary must be greater than 0")
    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal salary;

    @NotNull(message = "Hire date is required")
    @Column(nullable = false)
    private LocalDate hireDate;

    @NotNull(message = "Status is required")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private EmployeeStatus status = EmployeeStatus.ACTIVE;

    @Size(max = 500, message = "Profile image URL must be at most 500 characters")
    @Column(length = 500)
    private String profileImage;

    @Column(nullable = false, updatable = false, length = 100)
    private String createdBy;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(length = 100)
    private String updatedBy;

    private LocalDateTime updatedAt;

    protected Employee() {
    }

    public Employee(
            String employeeCode,
            String firstName,
            String lastName,
            String email,
            String phone,
            Department department,
            String jobTitle,
            EmploymentType employmentType,
            BigDecimal salary,
            LocalDate hireDate,
            EmployeeStatus status,
            String profileImage,
            String createdBy
    ) {
        this.employeeCode = employeeCode;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.phone = phone;
        this.department = department;
        this.jobTitle = jobTitle;
        this.employmentType = employmentType;
        this.salary = salary;
        this.hireDate = hireDate;
        this.status = status == null ? EmployeeStatus.ACTIVE : status;
        this.profileImage = profileImage;
        this.createdBy = createdBy;
    }

    @PrePersist
    void prePersist() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
        if (createdBy == null || createdBy.isBlank()) {
            createdBy = "system";
        }
    }

    @PreUpdate
    void preUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public void updateDetails(
            String employeeCode,
            String firstName,
            String lastName,
            String email,
            String phone,
            Department department,
            String jobTitle,
            EmploymentType employmentType,
            BigDecimal salary,
            LocalDate hireDate,
            EmployeeStatus status,
            String profileImage,
            String updatedBy
    ) {
        this.employeeCode = employeeCode;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.phone = phone;
        this.department = department;
        this.jobTitle = jobTitle;
        this.employmentType = employmentType;
        this.salary = salary;
        this.hireDate = hireDate;
        this.status = status == null ? EmployeeStatus.ACTIVE : status;
        this.profileImage = profileImage;
        this.updatedBy = updatedBy;
        this.updatedAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public String getEmployeeCode() {
        return employeeCode;
    }

    public String getFirstName() {
        return firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public String getEmail() {
        return email;
    }

    public String getPhone() {
        return phone;
    }

    public Department getDepartment() {
        return department;
    }

    public String getJobTitle() {
        return jobTitle;
    }

    public EmploymentType getEmploymentType() {
        return employmentType;
    }

    public BigDecimal getSalary() {
        return salary;
    }

    public LocalDate getHireDate() {
        return hireDate;
    }

    public EmployeeStatus getStatus() {
        return status;
    }

    public String getProfileImage() {
        return profileImage;
    }

    public String getCreatedBy() {
        return createdBy;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public String getUpdatedBy() {
        return updatedBy;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
}
