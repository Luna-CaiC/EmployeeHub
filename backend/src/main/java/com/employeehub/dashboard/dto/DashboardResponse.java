package com.employeehub.dashboard.dto;

import com.employeehub.employee.entity.EmployeeStatus;
import java.time.LocalDate;
import java.util.List;

public record DashboardResponse(
        long totalEmployees,
        long activeEmployees,
        long inactiveEmployees,
        long totalDepartments,
        List<RecentEmployeeResponse> recentEmployees
) {

    public record RecentEmployeeResponse(
            String employeeCode,
            String fullName,
            String department,
            String jobTitle,
            LocalDate hireDate,
            EmployeeStatus status
    ) {
    }
}
