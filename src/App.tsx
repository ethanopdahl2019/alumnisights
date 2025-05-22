
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@/components/theme-provider';
import AuthProvider from '@/components/AuthProvider';

// Page imports
import Index from '@/pages/Index';
import NotFound from '@/pages/NotFound';
import Auth from '@/pages/Auth';
import Browse from '@/pages/Browse';
import MyAccount from '@/pages/MyAccount';
import MentorDashboard from '@/pages/MentorDashboard';
import StudentDashboard from '@/pages/StudentDashboard';
import AlumniProfilePage from '@/pages/AlumniProfilePage';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import RegistrationControl from '@/pages/admin/RegistrationControl';
import UserManagement from '@/pages/admin/UserManagement';
import ProfileManagement from '@/pages/admin/ProfileManagement';

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="alumni-theme-preference">
      <AuthProvider>
        <Router>
          <Routes>
            {/* Main Pages */}
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/browse" element={<Browse />} />
            <Route path="/account" element={<MyAccount />} />
            <Route path="/mentor-dashboard" element={<MentorDashboard />} />
            <Route path="/student-dashboard" element={<StudentDashboard />} />
            <Route path="/alumni/:id" element={<AlumniProfilePage />} />
            
            {/* Admin Pages */}
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/registration-control" element={<RegistrationControl />} />
            <Route path="/admin/users" element={<UserManagement />} />
            <Route path="/admin/profile-management" element={<ProfileManagement />} />
            
            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
