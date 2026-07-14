import { useEffect, useState } from 'react';
import LoadingState from '../components/LoadingState.jsx';
import PageHeader from '../components/PageHeader.jsx';
import StatusMessage from '../components/StatusMessage.jsx';
import apiClient, { getApiErrorMessage } from '../services/apiClient.js';

const emptyProfileForm = {
  name: '',
  email: '',
  phone: '',
  department: '',
};

const emptyPasswordForm = {
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
};

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [profileForm, setProfileForm] = useState(emptyProfileForm);
  const [passwordForm, setPasswordForm] = useState(emptyPasswordForm);
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadProfile();
  }, []);

  function loadProfile() {
    setLoading(true);
    setError('');

    apiClient
      .get('/auth/profile')
      .then((response) => {
        setProfile(response.data);
        setProfileForm(toProfileForm(response.data));
      })
      .catch((requestError) => setError(getApiErrorMessage(requestError, 'Profile could not be loaded.')))
      .finally(() => setLoading(false));
  }

  function openProfileEditor() {
    setMessage('');
    setError('');
    setProfileForm(toProfileForm(profile));
    setEditingProfile(true);
  }

  function openPasswordEditor() {
    setMessage('');
    setError('');
    setPasswordForm(emptyPasswordForm);
    setChangingPassword(true);
  }

  async function handleProfileSubmit(event) {
    event.preventDefault();
    setSavingProfile(true);
    setError('');
    setMessage('');

    try {
      const response = await apiClient.put('/auth/profile', {
        name: profileForm.name,
        email: profileForm.email,
        phone: profileForm.phone || null,
        department: profileForm.department || null,
      });
      setProfile(response.data);
      setProfileForm(toProfileForm(response.data));
      setEditingProfile(false);
      setMessage('Profile updated.');
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, 'Profile could not be updated.'));
    } finally {
      setSavingProfile(false);
    }
  }

  async function handlePasswordSubmit(event) {
    event.preventDefault();
    setSavingPassword(true);
    setError('');
    setMessage('');

    try {
      const response = await apiClient.put('/auth/profile/password', passwordForm);
      setChangingPassword(false);
      setPasswordForm(emptyPasswordForm);
      setMessage(response.data?.message || 'Password changed successfully.');
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, 'Password could not be changed.'));
    } finally {
      setSavingPassword(false);
    }
  }

  if (loading) {
    return <LoadingState label="Loading profile" />;
  }

  return (
    <>
      <PageHeader title="Profile" description="Current user" />
      <div className="mb-4 space-y-3">
        <StatusMessage type="success">{message}</StatusMessage>
        <StatusMessage type="error">{error}</StatusMessage>
      </div>
      <section className="max-w-3xl rounded-md border border-slate-200 bg-white p-5 shadow-sm">
        <div className="grid gap-4 md:grid-cols-2">
          <ProfileItem label="Username" value={profile?.username || '-'} />
          <ProfileItem label="Role" value={profile?.role || '-'} />
          <ProfileItem label="Name" value={profile?.name || '-'} />
          <ProfileItem label="Email" value={profile?.email || '-'} />
          <ProfileItem label="Phone" value={profile?.phone || '-'} />
          <ProfileItem label="Department" value={profile?.department || '-'} />
          <ProfileItem label="Enabled" value={profile?.enabled === undefined ? '-' : profile.enabled ? 'Yes' : 'No'} />
          <ProfileItem label="Created At" value={profile?.createdAt ? new Date(profile.createdAt).toLocaleString() : '-'} />
        </div>
        <div className="mt-6 grid gap-3 border-t border-slate-200 pt-5 md:grid-cols-2">
          <button
            className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
            type="button"
            onClick={openProfileEditor}
          >
            Edit Profile
          </button>
          <button
            className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
            type="button"
            onClick={openPasswordEditor}
          >
            Change Password
          </button>
        </div>
      </section>

      {editingProfile ? (
        <Dialog title="Edit Profile" onClose={() => setEditingProfile(false)}>
          <form className="space-y-4" onSubmit={handleProfileSubmit}>
            <Field label="Name" value={profileForm.name} onChange={(value) => setProfileForm({ ...profileForm, name: value })} required />
            <Field label="Email" type="email" value={profileForm.email} onChange={(value) => setProfileForm({ ...profileForm, email: value })} required />
            <Field label="Phone" value={profileForm.phone} onChange={(value) => setProfileForm({ ...profileForm, phone: value })} />
            <Field label="Department" value={profileForm.department} onChange={(value) => setProfileForm({ ...profileForm, department: value })} />
            <DialogActions saving={savingProfile} saveLabel="Save Profile" onCancel={() => setEditingProfile(false)} />
          </form>
        </Dialog>
      ) : null}

      {changingPassword ? (
        <Dialog title="Change Password" onClose={() => setChangingPassword(false)}>
          <form className="space-y-4" onSubmit={handlePasswordSubmit}>
            <Field
              label="Current Password"
              type="password"
              value={passwordForm.currentPassword}
              onChange={(value) => setPasswordForm({ ...passwordForm, currentPassword: value })}
              required
            />
            <Field
              label="New Password"
              type="password"
              value={passwordForm.newPassword}
              onChange={(value) => setPasswordForm({ ...passwordForm, newPassword: value })}
              required
              minLength={8}
            />
            <Field
              label="Confirm Password"
              type="password"
              value={passwordForm.confirmPassword}
              onChange={(value) => setPasswordForm({ ...passwordForm, confirmPassword: value })}
              required
              minLength={8}
            />
            <DialogActions saving={savingPassword} saveLabel="Change Password" onCancel={() => setChangingPassword(false)} />
          </form>
        </Dialog>
      ) : null}
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

function Dialog({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-slate-950/40 px-4 py-8">
      <section className="w-full max-w-lg rounded-md border border-slate-200 bg-white p-5 shadow-xl">
        <div className="mb-5 flex items-center justify-between gap-4">
          <h2 className="text-lg font-semibold text-slate-950">{title}</h2>
          <button className="rounded-md px-2 py-1 text-sm font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-900" type="button" onClick={onClose}>
            Close
          </button>
        </div>
        {children}
      </section>
    </div>
  );
}

function Field({ label, type = 'text', value, onChange, required = false, minLength }) {
  return (
    <label className="block text-sm font-medium text-slate-700">
      {label}
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required={required}
        minLength={minLength}
        className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
      />
    </label>
  );
}

function DialogActions({ saving, saveLabel, onCancel }) {
  return (
    <div className="flex justify-end gap-3 border-t border-slate-200 pt-5">
      <button className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100" type="button" onClick={onCancel}>
        Cancel
      </button>
      <button className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50" disabled={saving} type="submit">
        {saving ? 'Saving' : saveLabel}
      </button>
    </div>
  );
}

function toProfileForm(profile) {
  return {
    name: profile?.name || '',
    email: profile?.email || '',
    phone: profile?.phone || '',
    department: profile?.department || '',
  };
}
