import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import LoadingState from '../components/LoadingState.jsx';
import PageHeader from '../components/PageHeader.jsx';
import StatusMessage from '../components/StatusMessage.jsx';
import apiClient, { getApiErrorMessage } from '../services/apiClient.js';

export default function DepartmentFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  const [form, setForm] = useState({ name: '', description: '' });
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isEditing) {
      return;
    }

    apiClient
      .get(`/departments/${id}`)
      .then((response) => setForm({ name: response.data.name || '', description: response.data.description || '' }))
      .catch((requestError) => setError(getApiErrorMessage(requestError, 'Department could not be loaded.')))
      .finally(() => setLoading(false));
  }, [id, isEditing]);

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setError('');

    try {
      if (isEditing) {
        await apiClient.put(`/departments/${id}`, form);
      } else {
        await apiClient.post('/departments', form);
      }
      navigate('/departments');
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, 'Department could not be saved.'));
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <LoadingState label="Loading department" />;
  }

  return (
    <>
      <PageHeader
        title={isEditing ? 'Edit Department' : 'New Department'}
        actions={<Link className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100" to="/departments">Back</Link>}
      />
      <form className="max-w-2xl rounded-md border border-slate-200 bg-white p-5 shadow-sm" onSubmit={handleSubmit}>
        <div className="mb-5">
          <StatusMessage type="error">{error}</StatusMessage>
        </div>
        <label className="block text-sm font-medium text-slate-700">
          Name
          <input
            value={form.name}
            onChange={(event) => setForm({ ...form, name: event.target.value })}
            required
            className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
          />
        </label>
        <label className="mt-4 block text-sm font-medium text-slate-700">
          Description
          <textarea
            value={form.description}
            onChange={(event) => setForm({ ...form, description: event.target.value })}
            rows="4"
            className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
          />
        </label>
        <div className="mt-6 flex justify-end gap-3">
          <Link className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100" to="/departments">
            Cancel
          </Link>
          <button className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50" disabled={saving} type="submit">
            {saving ? 'Saving' : 'Save Department'}
          </button>
        </div>
      </form>
    </>
  );
}
