package com.employeehub.employee.service;

import com.employeehub.department.entity.Department;
import com.employeehub.department.repository.DepartmentRepository;
import com.employeehub.employee.dto.EmployeePageResponse;
import com.employeehub.employee.dto.EmployeeRequest;
import com.employeehub.employee.dto.EmployeeResponse;
import com.employeehub.employee.entity.Employee;
import com.employeehub.employee.entity.EmployeeStatus;
import com.employeehub.employee.repository.EmployeeRepository;
import com.employeehub.exception.DuplicateResourceException;
import com.employeehub.exception.ResourceNotFoundException;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import java.util.Locale;
import java.util.Map;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class EmployeeService {

    private static final int MAX_PAGE_SIZE = 50;
    private static final Map<String, String> SORT_FIELDS = Map.of(
            "employeeCode", "employeeCode",
            "firstName", "firstName",
            "lastName", "lastName",
            "hireDate", "hireDate",
            "department", "department.name"
    );

    private final EmployeeRepository employeeRepository;
    private final DepartmentRepository departmentRepository;

    public EmployeeService(EmployeeRepository employeeRepository, DepartmentRepository departmentRepository) {
        this.employeeRepository = employeeRepository;
        this.departmentRepository = departmentRepository;
    }

    @Transactional(readOnly = true)
    public EmployeePageResponse getEmployees(
            String keyword,
            String department,
            EmployeeStatus status,
            int page,
            int size,
            String sort,
            String direction
    ) {
        Pageable pageable = buildPageable(page, size, sort, direction);
        Page<Employee> employees = employeeRepository.findAll(
                buildSpecification(keyword, department, status),
                pageable
        );

        return new EmployeePageResponse(
                employees.getContent()
                        .stream()
                        .map(this::toResponse)
                        .toList(),
                employees.getNumber(),
                employees.getSize(),
                employees.getTotalElements(),
                employees.getTotalPages()
        );
    }

    private Specification<Employee> buildSpecification(
            String keyword,
            String department,
            EmployeeStatus status
    ) {
        Specification<Employee> specification = Specification.where(null);

        String normalizedKeyword = normalizeOptionalText(keyword);
        if (normalizedKeyword != null) {
            specification = specification.and((root, query, criteriaBuilder) -> {
                String pattern = "%" + normalizedKeyword.toLowerCase(Locale.ROOT) + "%";
                return criteriaBuilder.or(
                        criteriaBuilder.like(criteriaBuilder.lower(root.get("employeeCode")), pattern),
                        criteriaBuilder.like(criteriaBuilder.lower(root.get("firstName")), pattern),
                        criteriaBuilder.like(criteriaBuilder.lower(root.get("lastName")), pattern),
                        criteriaBuilder.like(
                                criteriaBuilder.lower(
                                        criteriaBuilder.concat(
                                                criteriaBuilder.concat(root.<String>get("firstName"), " "),
                                                root.<String>get("lastName")
                                        )
                                ),
                                pattern
                        ),
                        criteriaBuilder.like(criteriaBuilder.lower(root.get("email")), pattern)
                );
            });
        }

        String normalizedDepartment = normalizeOptionalText(department);
        if (normalizedDepartment != null) {
            specification = specification.and((root, query, criteriaBuilder) -> {
                Join<Object, Object> departmentJoin = root.join("department", JoinType.INNER);
                return criteriaBuilder.equal(
                        criteriaBuilder.lower(departmentJoin.get("name")),
                        normalizedDepartment.toLowerCase(Locale.ROOT)
                );
            });
        }

        if (status != null) {
            specification = specification.and((root, query, criteriaBuilder) ->
                    criteriaBuilder.equal(root.get("status"), status)
            );
        }

        return specification;
    }

    private Pageable buildPageable(int page, int size, String sort, String direction) {
        int safePage = Math.max(page, 0);
        int safeSize = Math.min(Math.max(size, 1), MAX_PAGE_SIZE);
        String normalizedSort = sort == null ? "employeeCode" : sort;
        String sortProperty = SORT_FIELDS.getOrDefault(normalizedSort, SORT_FIELDS.get("employeeCode"));
        Sort.Direction sortDirection = "desc".equalsIgnoreCase(direction)
                ? Sort.Direction.DESC
                : Sort.Direction.ASC;

        return PageRequest.of(safePage, safeSize, Sort.by(sortDirection, sortProperty));
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
