
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@/components/theme-provider';
import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "@/components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Index from './pages/Index';
import AuthProvider from '@/components/AuthProvider';
import Auth from './pages/Auth';
import Browse from './pages/Browse';
import StudentDashboard from './pages/StudentDashboard';
import MentorDashboard from './pages/MentorDashboard';
import AlumniDashboard from './pages/AlumniDashboard';
import UndergraduateAdmissions from './pages/UndergraduateAdmissions';
import MyAccount from './pages/MyAccount';
import ApplicantDashboard from './pages/ApplicantDashboard';
import HowItWorks from './pages/HowItWorks';
import MentorChat from './pages/MentorChat';
import AlumniProfilePage from './pages/AlumniProfilePage';
import ProfileComplete from './pages/ProfileComplete';
import LandingPage from './pages/LandingPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import BookingPage from './pages/BookingPage';
import BookingSuccessPage from './pages/BookingSuccessPage';
import UniversityPage from './pages/insights/universities/UniversityPage';
import RegistrationControl from './pages/admin/RegistrationControl';
import UniversityContentManager from './pages/insights/universities/UniversityContentManager';

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
          <HelmetProvider>
            <Toaster />
            <AuthProvider>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/browse" element={<Browse />} />
                <Route path="/student-dashboard" element={<StudentDashboard />} />
                <Route path="/mentor-dashboard" element={<MentorDashboard />} />
                <Route path="/alumni-dashboard" element={<AlumniDashboard />} />
                <Route path="/my-account" element={<MyAccount />} />
                <Route path="/account" element={<MyAccount />} />
                <Route path="/applicant-dashboard" element={<ApplicantDashboard />} />
                <Route path="/how-it-works" element={<HowItWorks />} />
                <Route path="/mentor-chat" element={<MentorChat />} />
                <Route path="/alumni/:id" element={<AlumniProfilePage />} />
                <Route path="/profile-complete" element={<ProfileComplete />} />
                <Route path="/landing" element={<LandingPage />} />
                <Route path="/booking/:id/:productId" element={<BookingPage />} />
                <Route path="/booking-success" element={<BookingSuccessPage />} />
                
                {/* Admin Routes */}
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin-dashboard" element={<AdminDashboard />} />
                <Route path="/admin/registration-control" element={<RegistrationControl />} />
                <Route path="/admin/users" element={<AdminDashboard />} />
                <Route path="/admin/bookings" element={<AdminDashboard />} />
                <Route path="/admin/requests" element={<AdminDashboard />} />
                <Route path="/admin/analytics" element={<AdminDashboard />} />
                <Route path="/admin/emails" element={<AdminDashboard />} />
                <Route path="/admin/schools" element={<AdminDashboard />} />
                <Route path="/admin/companies" element={<AdminDashboard />} />
                <Route path="/admin/majors" element={<AdminDashboard />} />
                <Route path="/admin/activities" element={<AdminDashboard />} />
                <Route path="/admin/calendar" element={<AdminDashboard />} />
                <Route path="/admin/settings" element={<AdminDashboard />} />
                
                {/* Schools Routes */}
                <Route path="/schools" element={<UndergraduateAdmissions />} />
                <Route path="/undergraduate-admissions" element={<UndergraduateAdmissions />} />
                <Route path="/schools/undergraduate-admissions" element={<UndergraduateAdmissions />} />
                <Route path="/schools/undergraduate-admissions/:id" element={<UniversityPage />} />
                
                {/* Insights Routes */}
                <Route path="/insights/undergraduate-admissions" element={<UndergraduateAdmissions />} />
                <Route path="/insights/undergraduate-admissions/:id" element={<UniversityPage />} />
                <Route path="/insights/clubs-and-greek-life" element={<UndergraduateAdmissions />} />
                <Route path="/insights/industry" element={<UndergraduateAdmissions />} />
                <Route path="/insights/university-content-editor/:id" element={<UndergraduateAdmissions />} />
                <Route path="/insights/university-content-manager" element={<UniversityContentManager />} />
              </Routes>
            </AuthProvider>
          </HelmetProvider>
        </ThemeProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
