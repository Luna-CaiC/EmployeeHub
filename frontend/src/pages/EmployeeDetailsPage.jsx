import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import LoadingState from '../components/LoadingState.jsx';
import PageHeader from '../components/PageHeader.jsx';
import StatusMessage from '../components/StatusMessage.jsx';
import apiClient, { getApiErrorMessage } from '../services/apiClient.js';

export default function EmployeeDetailsPage() {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    apiClient
      .get(`/employees/${id}`)
      .then((response) => setEmployee(response.data))
      .catch((requestError) => setError(getApiErrorMessage(requestError, 'Employee could not be loaded.')))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <LoadingState label="Loading employee" />;
  }

  return (
    <>
      <PageHeader
        title="Employee Details"
        actions={
          <>
            <Link className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100" to="/employees">
              Back
            </Link>
            {employee ? (
              <Link className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800" to={`/employees/${employee.id}/edit`}>
                Edit
              </Link>
            ) : null}
          </>
        }
      />
      <StatusMessage type="error">{error}</StatusMessage>
      {employee ? (
        <section className="grid gap-4 rounded-md border border-slate-200 bg-white p-5 shadow-sm md:grid-cols-2">
          <Detail label="Employee Code" value={employee.employeeCode} />
          <Detail label="Status" value={employee.status} />
          <Detail label="Name" value={`${employee.firstName} ${employee.lastName}`} />
          <Detail label="Email" value={employee.email} />
          <Detail label="Phone" value={employee.phone || '-'} />
          <Detail label="Department" value={employee.departmentName} />
          <Detail label="Job Title" value={employee.jobTitle} />
          <Detail label="Employment Type" value={employee.employmentType} />
          <Detail label="Salary" value={employee.salary} />
          <Detail label="Hire Date" value={employee.hireDate} />
          <Detail label="Created By" value={employee.createdBy} />
          <Detail label="Created At" value={formatDateTime(employee.createdAt)} />
        </section>
      ) : null}
    </>
  );
}

function Detail({ label, value }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-1 text-sm font-medium text-slate-900">{value}</p>
    </div>
  );
}

function formatDateTime(value) {
  if (!value) {
    return '-';
  }

  return new Date(value).toLocaleString();
}
