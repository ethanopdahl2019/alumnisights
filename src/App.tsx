
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
import FeaturedSchoolsPage from './pages/admin/FeaturedSchools';
import BookingPage from './pages/BookingPage';
import BookingSuccessPage from './pages/BookingSuccessPage';
import UniversityPage from './pages/insights/universities/UniversityPage';
import RegistrationControl from './pages/admin/RegistrationControl';
import UniversityContentManager from './pages/insights/universities/UniversityContentManager';
import UniversityContentEditor from './pages/insights/universities/UniversityContentEditor';
import UserManagement from './pages/admin/UserManagement';
import BookingManagement from './pages/admin/BookingManagement';
import Analytics from './pages/admin/Analytics';
import GraduateAdmissions from './pages/insights/GraduateAdmissions';
import IndustryInsights from './pages/insights/IndustryInsights';
import ClubsAndGreekLife from './pages/insights/ClubsAndGreekLife';
import ContentProgress from './pages/admin/ContentProgress';
import AdmissionStatsManager from './pages/admin/AdmissionStatsManager';
import AboutUs from './pages/AboutUs';
import ScrollToTop from '@/components/ScrollToTop';
import Schools from './pages/Schools';

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <ScrollToTop />
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
                <Route path="/about" element={<AboutUs />} />
                <Route path="/schools" element={<Schools />} />
                
                {/* Admin Routes */}
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin-dashboard" element={<AdminDashboard />} />
                <Route path="/admin/featured-schools" element={<FeaturedSchoolsPage />} />
                <Route path="/admin/registration-control" element={<RegistrationControl />} />
                <Route path="/admin/users" element={<UserManagement />} />
                <Route path="/admin/bookings" element={<BookingManagement />} />
                <Route path="/admin/requests" element={<AdminDashboard />} />
                <Route path="/admin/analytics" element={<Analytics />} />
                <Route path="/admin/emails" element={<AdminDashboard />} />
                <Route path="/admin/schools" element={<AdminDashboard />} />
                <Route path="/admin/companies" element={<AdminDashboard />} />
                <Route path="/admin/majors" element={<AdminDashboard />} />
                <Route path="/admin/activities" element={<AdminDashboard />} />
                <Route path="/admin/calendar" element={<AdminDashboard />} />
                <Route path="/admin/settings" element={<AdminDashboard />} />
                <Route path="/admin/content-progress" element={<ContentProgress />} />
                <Route path="/admin/admission-stats" element={<AdmissionStatsManager />} />
                
                {/* Schools Routes */}
                <Route path="/undergraduate-admissions" element={<UndergraduateAdmissions />} />
                <Route path="/schools/undergraduate-admissions" element={<UndergraduateAdmissions />} />
                <Route path="/schools/undergraduate-admissions/:id" element={<UniversityPage />} />
                
                {/* Insights Routes */}
                <Route path="/insights/undergraduate-admissions" element={<UndergraduateAdmissions />} />
                <Route path="/insights/undergraduate-admissions/:id" element={<UniversityPage />} />
                <Route path="/insights/graduate-admissions" element={<GraduateAdmissions />} />
                <Route path="/insights/industry" element={<IndustryInsights />} />
                <Route path="/insights/clubs-and-greek-life" element={<ClubsAndGreekLife />} />
                <Route path="/insights/university-content-editor/:id" element={<UniversityContentEditor />} />
                <Route path="/insights/university-content-manager" element={<UniversityContentManager />} />
              </Routes>
            </AuthProvider>
          </HelmetProvider>
        </ThemeProvider>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
