import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import LoadingState from '../components/LoadingState.jsx';
import PageHeader from '../components/PageHeader.jsx';
import StatusMessage from '../components/StatusMessage.jsx';
import apiClient, { getApiErrorMessage } from '../services/apiClient.js';

const defaultFilters = {
  keyword: '',
  department: '',
  status: '',
  page: 0,
  size: 10,
  sort: 'employeeCode',
  direction: 'asc',
};

export default function EmployeeListPage() {
  const [filters, setFilters] = useState(defaultFilters);
  const [departments, setDepartments] = useState([]);
  const [employeePage, setEmployeePage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    apiClient
      .get('/departments')
      .then((response) => setDepartments(response.data))
      .catch(() => setDepartments([]));
  }, []);

  useEffect(() => {
    setLoading(true);
    setError('');
    apiClient
      .get('/employees', {
        params: {
          keyword: filters.keyword || undefined,
          department: filters.department || undefined,
          status: filters.status || undefined,
          page: filters.page,
          size: filters.size,
          sort: filters.sort,
          direction: filters.direction,
        },
      })
      .then((response) => setEmployeePage(response.data))
      .catch((requestError) => setError(getApiErrorMessage(requestError, 'Employees could not be loaded.')))
      .finally(() => setLoading(false));
  }, [filters]);

  function updateFilter(name, value) {
    setFilters((current) => ({
      ...current,
      [name]: value,
      page: name === 'page' ? value : 0,
    }));
  }

  async function handleDelete(employee) {
    if (!window.confirm(`Delete ${employee.firstName} ${employee.lastName}?`)) {
      return;
    }

    try {
      await apiClient.delete(`/employees/${employee.id}`);
      setMessage('Employee deleted.');
      setFilters((current) => ({ ...current }));
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, 'Employee could not be deleted.'));
    }
  }

  return (
    <>
      <PageHeader
        title="Employees"
        description="Employee directory"
        actions={
          <Link className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800" to="/employees/new">
            New Employee
          </Link>
        }
      />
      <div className="mb-4 grid gap-3 rounded-md border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-2 xl:grid-cols-6">
        <input
          value={filters.keyword}
          onChange={(event) => updateFilter('keyword', event.target.value)}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm xl:col-span-2"
          placeholder="Search employees"
        />
        <select
          value={filters.department}
          onChange={(event) => updateFilter('department', event.target.value)}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm"
        >
          <option value="">All departments</option>
          {departments.map((department) => (
            <option key={department.id} value={department.name}>
              {department.name}
            </option>
          ))}
        </select>
        <select
          value={filters.status}
          onChange={(event) => updateFilter('status', event.target.value)}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm"
        >
          <option value="">All statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
        </select>
        <select
          value={filters.sort}
          onChange={(event) => updateFilter('sort', event.target.value)}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm"
        >
          <option value="employeeCode">Employee Code</option>
          <option value="firstName">First Name</option>
          <option value="lastName">Last Name</option>
          <option value="hireDate">Hire Date</option>
          <option value="department">Department</option>
        </select>
        <select
          value={filters.direction}
          onChange={(event) => updateFilter('direction', event.target.value)}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm"
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>
      <div className="mb-4 space-y-3">
        <StatusMessage type="success">{message}</StatusMessage>
        <StatusMessage type="error">{error}</StatusMessage>
      </div>
      {loading ? (
        <LoadingState label="Loading employees" />
      ) : (
        <section className="rounded-md border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-3">Code</th>
                  <th className="px-5 py-3">Name</th>
                  <th className="px-5 py-3">Email</th>
                  <th className="px-5 py-3">Department</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {employeePage?.employees?.map((employee) => (
                  <tr key={employee.id}>
                    <td className="px-5 py-3 font-medium text-slate-900">{employee.employeeCode}</td>
                    <td className="px-5 py-3">{employee.firstName} {employee.lastName}</td>
                    <td className="px-5 py-3">{employee.email}</td>
                    <td className="px-5 py-3">{employee.departmentName}</td>
                    <td className="px-5 py-3">{employee.status}</td>
                    <td className="px-5 py-3">
                      <div className="flex flex-wrap gap-2">
                        <Link className="text-sm font-medium text-slate-700 hover:text-slate-950" to={`/employees/${employee.id}`}>View</Link>
                        <Link className="text-sm font-medium text-slate-700 hover:text-slate-950" to={`/employees/${employee.id}/edit`}>Edit</Link>
                        <button className="text-sm font-medium text-red-600 hover:text-red-700" type="button" onClick={() => handleDelete(employee)}>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {!employeePage?.employees?.length ? (
                  <tr>
                    <td className="px-5 py-6 text-center text-slate-500" colSpan="6">
                      No employees found.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
          <div className="flex flex-col gap-3 border-t border-slate-200 px-5 py-4 text-sm text-slate-600 md:flex-row md:items-center md:justify-between">
            <span>
              Page {(employeePage?.currentPage ?? 0) + 1} of {employeePage?.totalPages || 1} · {employeePage?.totalRecords || 0} records
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={!employeePage || employeePage.currentPage === 0}
                onClick={() => updateFilter('page', filters.page - 1)}
                className="rounded-md border border-slate-300 px-3 py-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Previous
              </button>
              <button
                type="button"
                disabled={!employeePage || employeePage.currentPage + 1 >= employeePage.totalPages}
                onClick={() => updateFilter('page', filters.page + 1)}
                className="rounded-md border border-slate-300 px-3 py-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
