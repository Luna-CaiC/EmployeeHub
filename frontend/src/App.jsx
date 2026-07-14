import { Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import AuthProvider from './context/AuthProvider.jsx';
import MainLayout from './layouts/MainLayout.jsx';
import ComingSoonPage from './pages/ComingSoonPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import DepartmentFormPage from './pages/DepartmentFormPage.jsx';
import DepartmentListPage from './pages/DepartmentListPage.jsx';
import EmployeeDetailsPage from './pages/EmployeeDetailsPage.jsx';
import EmployeeFormPage from './pages/EmployeeFormPage.jsx';
import EmployeeListPage from './pages/EmployeeListPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/employees" element={<EmployeeListPage />} />
            <Route path="/employees/new" element={<EmployeeFormPage />} />
            <Route path="/employees/:id" element={<EmployeeDetailsPage />} />
            <Route path="/employees/:id/edit" element={<EmployeeFormPage />} />
            <Route path="/departments" element={<DepartmentListPage />} />
            <Route path="/departments/new" element={<DepartmentFormPage />} />
            <Route path="/departments/:id/edit" element={<DepartmentFormPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/announcements" element={<ComingSoonPage title="Announcements" />} />
            <Route path="/tasks" element={<ComingSoonPage title="Tasks" />} />
            <Route path="/attendance" element={<ComingSoonPage title="Attendance" />} />
            <Route path="/leave-requests" element={<ComingSoonPage title="Leave Requests" />} />
            <Route path="/reports" element={<ComingSoonPage title="Reports" />} />
            <Route path="/settings" element={<ComingSoonPage title="Settings" />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AuthProvider>
  );
}
