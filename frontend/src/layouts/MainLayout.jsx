import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';

const primaryLinks = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/employees', label: 'Employees' },
  { to: '/departments', label: 'Departments' },
  { to: '/profile', label: 'Profile' },
];

const reservedLinks = [
  { to: '/announcements', label: 'Announcements' },
  { to: '/tasks', label: 'Tasks' },
  { to: '/attendance', label: 'Attendance' },
  { to: '/leave-requests', label: 'Leave Requests' },
  { to: '/reports', label: 'Reports' },
  { to: '/settings', label: 'Settings' },
];

function SidebarLink({ to, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `block rounded-md px-3 py-2 text-sm font-medium ${
          isActive ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950'
        }`
      }
    >
      {label}
    </NavLink>
  );
}

export default function MainLayout() {
  const auth = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    auth.logout();
    navigate('/login', { replace: true });
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white">
        <div className="flex h-16 items-center justify-between px-4 md:px-6">
          <div>
            <span className="text-lg font-semibold text-slate-950">EmployeeHub</span>
            <span className="ml-3 hidden text-sm text-slate-500 sm:inline">Internal Workforce Management</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-slate-600 sm:inline">{auth.user?.username}</span>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              Logout
            </button>
          </div>
        </div>
      </header>
      <div className="flex">
        <aside className="hidden min-h-[calc(100vh-4rem)] w-64 border-r border-slate-200 bg-white px-4 py-6 md:block">
          <nav className="space-y-1">
            {primaryLinks.map((link) => (
              <SidebarLink key={link.to} {...link} />
            ))}
          </nav>
          <div className="mt-8 border-t border-slate-200 pt-5">
            <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wide text-slate-400">Reserved</p>
            <nav className="space-y-1">
              {reservedLinks.map((link) => (
                <SidebarLink key={link.to} {...link} />
              ))}
            </nav>
          </div>
        </aside>
        <main className="min-w-0 flex-1 px-4 py-6 md:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
