import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import LoadingState from '../components/LoadingState.jsx';
import PageHeader from '../components/PageHeader.jsx';
import StatusMessage from '../components/StatusMessage.jsx';
import apiClient, { getApiErrorMessage } from '../services/apiClient.js';

const emptyEmployee = {
  employeeCode: '',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  departmentId: '',
  jobTitle: '',
  employmentType: 'FULL_TIME',
  salary: '',
  hireDate: '',
  status: 'ACTIVE',
  profileImage: '',
};

export default function EmployeeFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  const [form, setForm] = useState(emptyEmployee);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    apiClient
      .get('/departments')
      .then((response) => setDepartments(response.data))
      .catch((requestError) => setError(getApiErrorMessage(requestError, 'Departments could not be loaded.')));
  }, []);

  useEffect(() => {
    if (!isEditing) {
      return;
    }

    apiClient
      .get(`/employees/${id}`)
      .then((response) => {
        const employee = response.data;
        setForm({
          employeeCode: employee.employeeCode || '',
          firstName: employee.firstName || '',
          lastName: employee.lastName || '',
          email: employee.email || '',
          phone: employee.phone || '',
          departmentId: employee.departmentId || '',
          jobTitle: employee.jobTitle || '',
          employmentType: employee.employmentType || 'FULL_TIME',
          salary: employee.salary || '',
          hireDate: employee.hireDate || '',
          status: employee.status || 'ACTIVE',
          profileImage: employee.profileImage || '',
        });
      })
      .catch((requestError) => setError(getApiErrorMessage(requestError, 'Employee could not be loaded.')))
      .finally(() => setLoading(false));
  }, [id, isEditing]);

  const title = useMemo(() => (isEditing ? 'Edit Employee' : 'New Employee'), [isEditing]);

  function updateField(name, value) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setError('');

    const payload = {
      ...form,
      departmentId: Number(form.departmentId),
      salary: Number(form.salary),
      phone: form.phone || null,
      profileImage: form.profileImage || null,
    };

    try {
      const response = isEditing
        ? await apiClient.put(`/employees/${id}`, payload)
        : await apiClient.post('/employees', payload);
      navigate(`/employees/${response.data.id}`);
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, 'Employee could not be saved.'));
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <LoadingState label="Loading employee" />;
  }

  return (
    <>
      <PageHeader
        title={title}
        actions={<Link className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100" to="/employees">Back</Link>}
      />
      <form className="rounded-md border border-slate-200 bg-white p-5 shadow-sm" onSubmit={handleSubmit}>
        <div className="mb-5">
          <StatusMessage type="error">{error}</StatusMessage>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Employee Code" value={form.employeeCode} onChange={(value) => updateField('employeeCode', value)} required />
          <Field label="Email" type="email" value={form.email} onChange={(value) => updateField('email', value)} required />
          <Field label="First Name" value={form.firstName} onChange={(value) => updateField('firstName', value)} required />
          <Field label="Last Name" value={form.lastName} onChange={(value) => updateField('lastName', value)} required />
          <Field label="Phone" value={form.phone} onChange={(value) => updateField('phone', value)} />
          <Field label="Job Title" value={form.jobTitle} onChange={(value) => updateField('jobTitle', value)} required />
          <Select label="Department" value={form.departmentId} onChange={(value) => updateField('departmentId', value)} required>
            <option value="">Select department</option>
            {departments.map((department) => (
              <option key={department.id} value={department.id}>
                {department.name}
              </option>
            ))}
          </Select>
          <Select label="Employment Type" value={form.employmentType} onChange={(value) => updateField('employmentType', value)} required>
            <option value="FULL_TIME">Full Time</option>
            <option value="PART_TIME">Part Time</option>
            <option value="CONTRACT">Contract</option>
            <option value="INTERN">Intern</option>
          </Select>
          <Field label="Salary" type="number" value={form.salary} onChange={(value) => updateField('salary', value)} required />
          <Field label="Hire Date" type="date" value={form.hireDate} onChange={(value) => updateField('hireDate', value)} required />
          <Select label="Status" value={form.status} onChange={(value) => updateField('status', value)}>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </Select>
          <Field label="Profile Image URL" value={form.profileImage} onChange={(value) => updateField('profileImage', value)} />
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <Link className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100" to="/employees">
            Cancel
          </Link>
          <button className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50" disabled={saving} type="submit">
            {saving ? 'Saving' : 'Save Employee'}
          </button>
        </div>
      </form>
    </>
  );
}

function Field({ label, type = 'text', value, onChange, required = false }) {
  return (
    <label className="block text-sm font-medium text-slate-700">
      {label}
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required={required}
        className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
      />
    </label>
  );
}

function Select({ label, value, onChange, required = false, children }) {
  return (
    <label className="block text-sm font-medium text-slate-700">
      {label}
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required={required}
        className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
      >
        {children}
      </select>
    </label>
  );
}
