package com.employeehub.employee.repository;

import com.employeehub.employee.entity.Employee;
import com.employeehub.employee.entity.EmployeeStatus;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {

    long countByStatus(EmployeeStatus status);

    List<Employee> findTop5ByOrderByHireDateDesc();

    boolean existsByEmployeeCodeIgnoreCase(String employeeCode);

    boolean existsByEmployeeCodeIgnoreCaseAndIdNot(String employeeCode, Long id);

    boolean existsByEmailIgnoreCase(String email);

    boolean existsByEmailIgnoreCaseAndIdNot(String email, Long id);
}
