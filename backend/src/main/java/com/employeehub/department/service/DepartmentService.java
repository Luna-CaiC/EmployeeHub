package com.employeehub.department.service;

import com.employeehub.department.dto.DepartmentRequest;
import com.employeehub.department.dto.DepartmentResponse;
import com.employeehub.department.entity.Department;
import com.employeehub.department.repository.DepartmentRepository;
import com.employeehub.exception.BusinessRuleException;
import com.employeehub.exception.DuplicateResourceException;
import com.employeehub.exception.ResourceNotFoundException;
import java.util.List;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class DepartmentService {

    private final DepartmentRepository departmentRepository;

    public DepartmentService(DepartmentRepository departmentRepository) {
        this.departmentRepository = departmentRepository;
    }

    @Transactional(readOnly = true)
    public List<DepartmentResponse> getAllDepartments() {
        return departmentRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public DepartmentResponse getDepartmentById(Long id) {
        return toResponse(findDepartmentById(id));
    }

    @Transactional
    public DepartmentResponse createDepartment(DepartmentRequest request) {
        String name = normalizeName(request.name());
        validateUniqueNameForCreate(name);

        Department department = new Department(name, normalizeDescription(request.description()));
        Department savedDepartment = departmentRepository.save(department);
        return toResponse(savedDepartment);
    }

    @Transactional
    public DepartmentResponse updateDepartment(Long id, DepartmentRequest request) {
        Department department = findDepartmentById(id);
        String name = normalizeName(request.name());
        validateUniqueNameForUpdate(name, id);

        department.updateDetails(name, normalizeDescription(request.description()));
        return toResponse(department);
    }

    @Transactional
    public void deleteDepartment(Long id) {
        Department department = findDepartmentById(id);
        try {
            departmentRepository.delete(department);
            departmentRepository.flush();
        } catch (DataIntegrityViolationException exception) {
            throw new BusinessRuleException("Department containing employees cannot be deleted");
        }
    }

    private Department findDepartmentById(Long id) {
        return departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found"));
    }

    private void validateUniqueNameForCreate(String name) {
        if (departmentRepository.existsByNameIgnoreCase(name)) {
            throw new DuplicateResourceException("Department name already exists");
        }
    }

    private void validateUniqueNameForUpdate(String name, Long id) {
        if (departmentRepository.existsByNameIgnoreCaseAndIdNot(name, id)) {
            throw new DuplicateResourceException("Department name already exists");
        }
    }

    private DepartmentResponse toResponse(Department department) {
        return new DepartmentResponse(
                department.getId(),
                department.getName(),
                department.getDescription(),
                department.getCreatedAt()
        );
    }

    private String normalizeName(String name) {
        return name == null ? null : name.trim();
    }

    private String normalizeDescription(String description) {
        if (description == null || description.isBlank()) {
            return null;
        }
        return description.trim();
    }
}
