package com.employeehub.dashboard.service;

import com.employeehub.dashboard.dto.DashboardResponse;
import com.employeehub.dashboard.dto.DashboardResponse.RecentEmployeeResponse;
import com.employeehub.department.repository.DepartmentRepository;
import com.employeehub.employee.entity.Employee;
import com.employeehub.employee.entity.EmployeeStatus;
import com.employeehub.employee.repository.EmployeeRepository;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class DashboardService {

    private final EmployeeRepository employeeRepository;
    private final DepartmentRepository departmentRepository;

    public DashboardService(
            EmployeeRepository employeeRepository,
            DepartmentRepository departmentRepository
    ) {
        this.employeeRepository = employeeRepository;
        this.departmentRepository = departmentRepository;
    }

    @Transactional(readOnly = true)
    public DashboardResponse getDashboard() {
        long totalEmployees = employeeRepository.count();
        long activeEmployees = employeeRepository.countByStatus(EmployeeStatus.ACTIVE);
        long inactiveEmployees = employeeRepository.countByStatus(EmployeeStatus.INACTIVE);
        long totalDepartments = departmentRepository.count();
        List<RecentEmployeeResponse> recentEmployees = employeeRepository.findTop5ByOrderByHireDateDesc()
                .stream()
                .map(this::toRecentEmployeeResponse)
                .toList();

        return new DashboardResponse(
                totalEmployees,
                activeEmployees,
                inactiveEmployees,
                totalDepartments,
                recentEmployees
        );
    }

    private RecentEmployeeResponse toRecentEmployeeResponse(Employee employee) {
        return new RecentEmployeeResponse(
                employee.getEmployeeCode(),
                employee.getFirstName() + " " + employee.getLastName(),
                employee.getDepartment().getName(),
                employee.getJobTitle(),
                employee.getHireDate(),
                employee.getStatus()
        );
    }
}
