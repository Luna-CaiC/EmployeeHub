import { useEffect, useState } from 'react';
import PageHeader from '../components/PageHeader.jsx';
import StatusMessage from '../components/StatusMessage.jsx';
import apiClient, { getApiErrorMessage } from '../services/apiClient.js';

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    apiClient
      .get('/auth/profile')
      .then((response) => setProfile(response.data))
      .catch((requestError) => setError(getApiErrorMessage(requestError, 'Profile could not be loaded.')));
  }, []);

  return (
    <>
      <PageHeader title="Profile" description="Current user" />
      <div className="mb-4">
        <StatusMessage type="error">{error}</StatusMessage>
      </div>
      <section className="max-w-3xl rounded-md border border-slate-200 bg-white p-5 shadow-sm">
        <div className="grid gap-4 md:grid-cols-2">
          <ProfileItem label="Username" value={profile?.username || '-'} />
          <ProfileItem label="Role" value={profile?.role || '-'} />
          <ProfileItem label="Enabled" value={profile?.enabled === undefined ? '-' : profile.enabled ? 'Yes' : 'No'} />
          <ProfileItem label="Created At" value={profile?.createdAt ? new Date(profile.createdAt).toLocaleString() : '-'} />
          <ProfileItem label="Name" value="-" />
          <ProfileItem label="Email" value="-" />
          <ProfileItem label="Phone" value="-" />
          <ProfileItem label="Department" value="-" />
        </div>
        <div className="mt-6 grid gap-3 border-t border-slate-200 pt-5 md:grid-cols-2">
          <button className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-500" type="button" disabled>
            Edit Profile
          </button>
          <button className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-500" type="button" disabled>
            Change Password
          </button>
        </div>
      </section>
    </>
  );
}

function ProfileItem({ label, value }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-1 text-sm font-medium text-slate-900">{value}</p>
    </div>
  );
}
