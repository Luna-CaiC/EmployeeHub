import { useEffect, useState } from 'react';
import LoadingState from '../components/LoadingState.jsx';
import PageHeader from '../components/PageHeader.jsx';
import StatusMessage from '../components/StatusMessage.jsx';
import apiClient, { getApiErrorMessage } from '../services/apiClient.js';

function StatTile({ label, value }) {
  return (
    <div className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-3 text-3xl font-semibold text-slate-950">{value ?? 0}</p>
    </div>
  );
}

export default function DashboardPage() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    apiClient
      .get('/dashboard')
      .then((response) => setDashboard(response.data))
      .catch((requestError) => setError(getApiErrorMessage(requestError, 'Dashboard could not be loaded.')))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <LoadingState label="Loading dashboard" />;
  }

  return (
    <>
      <PageHeader title="Dashboard" description="Workforce summary" />
      <StatusMessage type="error">{error}</StatusMessage>
      {dashboard ? (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatTile label="Total Employees" value={dashboard.totalEmployees} />
            <StatTile label="Active Employees" value={dashboard.activeEmployees} />
            <StatTile label="Inactive Employees" value={dashboard.inactiveEmployees} />
            <StatTile label="Departments" value={dashboard.totalDepartments} />
          </div>
          <section className="rounded-md border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-5 py-4">
              <h2 className="text-base font-semibold text-slate-950">Recent Employees</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-sm">
                <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-5 py-3">Code</th>
                    <th className="px-5 py-3">Name</th>
                    <th className="px-5 py-3">Department</th>
                    <th className="px-5 py-3">Job Title</th>
                    <th className="px-5 py-3">Hire Date</th>
                    <th className="px-5 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {dashboard.recentEmployees?.map((employee) => (
                    <tr key={employee.employeeCode}>
                      <td className="px-5 py-3 font-medium text-slate-900">{employee.employeeCode}</td>
                      <td className="px-5 py-3">{employee.fullName}</td>
                      <td className="px-5 py-3">{employee.department}</td>
                      <td className="px-5 py-3">{employee.jobTitle}</td>
                      <td className="px-5 py-3">{employee.hireDate}</td>
                      <td className="px-5 py-3">{employee.status}</td>
                    </tr>
                  ))}
                  {!dashboard.recentEmployees?.length ? (
                    <tr>
                      <td className="px-5 py-6 text-center text-slate-500" colSpan="6">
                        No employees found.
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      ) : null}
    </>
  );
}
