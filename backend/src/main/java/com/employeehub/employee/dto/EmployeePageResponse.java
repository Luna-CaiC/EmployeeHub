package com.employeehub.employee.dto;

import java.util.List;

public record EmployeePageResponse(
        List<EmployeeResponse> employees,
        int currentPage,
        int pageSize,
        long totalRecords,
        int totalPages
) {
}
