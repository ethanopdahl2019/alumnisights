import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@/components/theme-provider';
import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "@/components/ui/toaster";
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

function App() {
  return (
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
              <Route path="/undergraduate-admissions" element={<UndergraduateAdmissions />} />
              <Route path="/my-account" element={<MyAccount />} />
              <Route path="/applicant-dashboard" element={<ApplicantDashboard />} />
              <Route path="/how-it-works" element={<HowItWorks />} />
              <Route path="/mentor-chat" element={<MentorChat />} />
              <Route path="/alumni/:id" element={<AlumniProfilePage />} />
              <Route path="/profile-complete" element={<ProfileComplete />} />
              <Route path="/universities/:id" element={<UndergraduateAdmissions />} />
              <Route path="/landing" element={<LandingPage />} />
              <Route path="/admin-dashboard" element={<AdminDashboard />} />
              <Route path="/booking/:id/:productId" element={<BookingPage />} />
              
              {/* Add the new route for booking success */}
              <Route path="/booking-success" element={<BookingSuccessPage />} />
              
            </Routes>
          </AuthProvider>
        </HelmetProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
