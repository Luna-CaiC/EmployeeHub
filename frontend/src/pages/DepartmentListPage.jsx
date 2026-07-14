import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import LoadingState from '../components/LoadingState.jsx';
import PageHeader from '../components/PageHeader.jsx';
import StatusMessage from '../components/StatusMessage.jsx';
import apiClient, { getApiErrorMessage } from '../services/apiClient.js';

export default function DepartmentListPage() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  function loadDepartments() {
    setLoading(true);
    apiClient
      .get('/departments')
      .then((response) => setDepartments(response.data))
      .catch((requestError) => setError(getApiErrorMessage(requestError, 'Departments could not be loaded.')))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadDepartments();
  }, []);

  async function handleDelete(department) {
    if (!window.confirm(`Delete ${department.name}?`)) {
      return;
    }

    try {
      await apiClient.delete(`/departments/${department.id}`);
      setMessage('Department deleted.');
      loadDepartments();
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, 'Department could not be deleted.'));
    }
  }

  return (
    <>
      <PageHeader
        title="Departments"
        description="Department directory"
        actions={
          <Link className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800" to="/departments/new">
            New Department
          </Link>
        }
      />
      <div className="mb-4 space-y-3">
        <StatusMessage type="success">{message}</StatusMessage>
        <StatusMessage type="error">{error}</StatusMessage>
      </div>
      {loading ? (
        <LoadingState label="Loading departments" />
      ) : (
        <section className="rounded-md border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-3">Name</th>
                  <th className="px-5 py-3">Description</th>
                  <th className="px-5 py-3">Employee Count</th>
                  <th className="px-5 py-3">Created</th>
                  <th className="px-5 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {departments.map((department) => (
                  <tr key={department.id}>
                    <td className="px-5 py-3 font-medium text-slate-900">{department.name}</td>
                    <td className="px-5 py-3">{department.description || '-'}</td>
                    <td className="px-5 py-3">{department.employeeCount ?? '-'}</td>
                    <td className="px-5 py-3">{department.createdAt ? new Date(department.createdAt).toLocaleDateString() : '-'}</td>
                    <td className="px-5 py-3">
                      <div className="flex gap-2">
                        <Link className="text-sm font-medium text-slate-700 hover:text-slate-950" to={`/departments/${department.id}/edit`}>
                          Edit
                        </Link>
                        <button className="text-sm font-medium text-red-600 hover:text-red-700" type="button" onClick={() => handleDelete(department)}>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {!departments.length ? (
                  <tr>
                    <td className="px-5 py-6 text-center text-slate-500" colSpan="5">
                      No departments found.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </>
  );
}
