package com.employeehub.employee.service;

import com.employeehub.department.entity.Department;
import com.employeehub.department.repository.DepartmentRepository;
import com.employeehub.employee.dto.EmployeeRequest;
import com.employeehub.employee.dto.EmployeeResponse;
import com.employeehub.employee.entity.Employee;
import com.employeehub.employee.repository.EmployeeRepository;
import com.employeehub.exception.DuplicateResourceException;
import com.employeehub.exception.ResourceNotFoundException;
import java.util.List;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final DepartmentRepository departmentRepository;

    public EmployeeService(EmployeeRepository employeeRepository, DepartmentRepository departmentRepository) {
        this.employeeRepository = employeeRepository;
        this.departmentRepository = departmentRepository;
    }

    @Transactional(readOnly = true)
    public List<EmployeeResponse> getAllEmployees() {
        return employeeRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public EmployeeResponse getEmployeeById(Long id) {
        return toResponse(findEmployeeById(id));
    }

    @Transactional
    public EmployeeResponse createEmployee(EmployeeRequest request) {
        String employeeCode = normalizeRequiredText(request.employeeCode());
        String email = normalizeEmail(request.email());
        validateUniqueEmployeeCodeForCreate(employeeCode);
        validateUniqueEmailForCreate(email);

        Department department = findDepartmentById(request.departmentId());
        Employee employee = new Employee(
                employeeCode,
                normalizeRequiredText(request.firstName()),
                normalizeRequiredText(request.lastName()),
                email,
                normalizeOptionalText(request.phone()),
                department,
                normalizeRequiredText(request.jobTitle()),
                request.employmentType(),
                request.salary(),
                request.hireDate(),
                request.status(),
                normalizeOptionalText(request.profileImage()),
                getCurrentUsername()
        );

        Employee savedEmployee = employeeRepository.save(employee);
        return toResponse(savedEmployee);
    }

    @Transactional
    public EmployeeResponse updateEmployee(Long id, EmployeeRequest request) {
        Employee employee = findEmployeeById(id);
        String employeeCode = normalizeRequiredText(request.employeeCode());
        String email = normalizeEmail(request.email());
        validateUniqueEmployeeCodeForUpdate(employeeCode, id);
        validateUniqueEmailForUpdate(email, id);

        Department department = findDepartmentById(request.departmentId());
        employee.updateDetails(
                employeeCode,
                normalizeRequiredText(request.firstName()),
                normalizeRequiredText(request.lastName()),
                email,
                normalizeOptionalText(request.phone()),
                department,
                normalizeRequiredText(request.jobTitle()),
                request.employmentType(),
                request.salary(),
                request.hireDate(),
                request.status(),
                normalizeOptionalText(request.profileImage()),
                getCurrentUsername()
        );

        return toResponse(employee);
    }

    @Transactional
    public void deleteEmployee(Long id) {
        Employee employee = findEmployeeById(id);
        employeeRepository.delete(employee);
    }

    private Employee findEmployeeById(Long id) {
        return employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found"));
    }

    private Department findDepartmentById(Long id) {
        return departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found"));
    }

    private void validateUniqueEmployeeCodeForCreate(String employeeCode) {
        if (employeeRepository.existsByEmployeeCodeIgnoreCase(employeeCode)) {
            throw new DuplicateResourceException("Employee code already exists");
        }
    }

    private void validateUniqueEmployeeCodeForUpdate(String employeeCode, Long id) {
        if (employeeRepository.existsByEmployeeCodeIgnoreCaseAndIdNot(employeeCode, id)) {
            throw new DuplicateResourceException("Employee code already exists");
        }
    }

    private void validateUniqueEmailForCreate(String email) {
        if (employeeRepository.existsByEmailIgnoreCase(email)) {
            throw new DuplicateResourceException("Employee email already exists");
        }
    }

    private void validateUniqueEmailForUpdate(String email, Long id) {
        if (employeeRepository.existsByEmailIgnoreCaseAndIdNot(email, id)) {
            throw new DuplicateResourceException("Employee email already exists");
        }
    }

    private EmployeeResponse toResponse(Employee employee) {
        Department department = employee.getDepartment();
        return new EmployeeResponse(
                employee.getId(),
                employee.getEmployeeCode(),
                employee.getFirstName(),
                employee.getLastName(),
                employee.getEmail(),
                employee.getPhone(),
                department.getId(),
                department.getName(),
                employee.getJobTitle(),
                employee.getEmploymentType(),
                employee.getSalary(),
                employee.getHireDate(),
                employee.getStatus(),
                employee.getProfileImage(),
                employee.getCreatedBy(),
                employee.getCreatedAt(),
                employee.getUpdatedBy(),
                employee.getUpdatedAt()
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

    private String getCurrentUsername() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || authentication.getName() == null || authentication.getName().isBlank()) {
            return "system";
        }
        return authentication.getName();
    }
}
