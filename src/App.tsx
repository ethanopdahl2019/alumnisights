
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import AuthProvider from "@/components/AuthProvider";
import Index from "./pages/Index";
import Browse from "./pages/Browse";
import NotFound from "./pages/NotFound";
import LandingPage from "./pages/LandingPage";
import Auth from "./pages/Auth";
import ProfileComplete from "./pages/ProfileComplete";
import Schools from "./pages/Schools";
import SchoolDetail from "./pages/SchoolDetail";
import AlumniDashboard from "./pages/AlumniDashboard";
import ApplicantDashboard from "./pages/ApplicantDashboard";
import AlumniProfilePage from "./pages/AlumniProfilePage";
import BookingPage from "./pages/BookingPage";
import SchoolMajorLanding from "./pages/SchoolMajorLanding";
import SchoolActivityLanding from "./pages/SchoolActivityLanding";
import MyAccount from "./pages/MyAccount";
import UndergraduateAdmissions from "./pages/UndergraduateAdmissions"; // Added this import

// Import the new dashboard pages
import MentorDashboard from "./pages/MentorDashboard";
import StudentDashboard from "./pages/StudentDashboard";

// Import the Insights pages
import GraduateAdmissions from "./pages/insights/GraduateAdmissions";
import IndustryInsights from "./pages/insights/IndustryInsights";
import ClubsAndGreekLife from "./pages/insights/ClubsAndGreekLife";
import UniversityAdmissions from "./pages/insights/UniversityAdmissions";

// Import the dynamic UniversityPage component
import UniversityPage from "./pages/insights/universities/UniversityPage";

// Import the university content management pages
import UniversityContentManager from "./pages/insights/universities/UniversityContentManager";
import UniversityContentEditor from "./pages/insights/universities/UniversityContentEditor";

// Import Admin dashboard pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import UserManagement from "./pages/admin/UserManagement";
import RequestManagement from "./pages/admin/RequestManagement";
import Analytics from "./pages/admin/Analytics";

// Import specific university pages
import AlleghenyCollege from "./pages/insights/universities/allegheny-college";
import AmericanUniversity from "./pages/insights/universities/american-university";
import AmherstCollege from "./pages/insights/universities/amherst-college";
import AppalachianStateUniversity from "./pages/insights/universities/appalachian-state-university";
import AuburnUniversity from "./pages/insights/universities/auburn-university";
import HarvardUniversity from "./pages/insights/universities/harvard-university";
import StanfordUniversity from "./pages/insights/universities/stanford-university";
import MITUniversity from "./pages/insights/universities/mit";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <HelmetProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/browse" element={<Browse />} />
              <Route path="/profile/complete" element={<ProfileComplete />} />
              <Route path="/schools" element={<Schools />} />
              <Route path="/schools/:id" element={<SchoolDetail />} />
              <Route path="/schools/undergraduate-admissions" element={<UndergraduateAdmissions />} />
              <Route path="/schools/undergraduate-admissions/:id" element={<UniversityPage />} />
              {/* Account and dashboards */}
              <Route path="/account" element={<MyAccount />} />
              <Route path="/alumni-dashboard" element={<AlumniDashboard />} />
              <Route path="/applicant-dashboard" element={<ApplicantDashboard />} />
              <Route path="/mentor-dashboard" element={<MentorDashboard />} />
              <Route path="/student-dashboard" element={<StudentDashboard />} />
              <Route path="/alumni/:id" element={<AlumniProfilePage />} />
              <Route path="/booking/:id/:productId" element={<BookingPage />} />
              <Route path="/p/:slug" element={<LandingPage />} />
              {/* School x Major/Activity landing pages */}
              <Route path="/schools/:schoolId/majors/:majorId" element={<SchoolMajorLanding />} />
              <Route path="/schools/:schoolId/activities/:activityId" element={<SchoolActivityLanding />} />
              
              {/* Insights routes */}
              <Route path="/insights/graduate-admissions" element={<GraduateAdmissions />} />
              <Route path="/insights/industry" element={<IndustryInsights />} />
              <Route path="/insights/clubs-and-greek-life" element={<ClubsAndGreekLife />} />
              
              {/* University content management routes */}
              <Route path="/insights/university-content-manager" element={<UniversityContentManager />} />
              <Route path="/insights/university-content-editor" element={<UniversityContentEditor />} />
              <Route path="/insights/university-content-editor/:id" element={<UniversityContentEditor />} />
              
              {/* Admin dashboard routes */}
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<UserManagement />} />
              <Route path="/admin/requests" element={<RequestManagement />} />
              <Route path="/admin/analytics" element={<Analytics />} />
              
              {/* Specific university routes for direct access */}
              <Route path="/schools/undergraduate-admissions/allegheny-college" element={<AlleghenyCollege />} />
              <Route path="/schools/undergraduate-admissions/american-university" element={<AmericanUniversity />} />
              <Route path="/schools/undergraduate-admissions/amherst-college" element={<AmherstCollege />} />
              <Route path="/schools/undergraduate-admissions/appalachian-state-university" element={<AppalachianStateUniversity />} />
              <Route path="/schools/undergraduate-admissions/auburn-university" element={<AuburnUniversity />} />
              <Route path="/schools/undergraduate-admissions/harvard-university" element={<HarvardUniversity />} />
              <Route path="/schools/undergraduate-admissions/stanford-university" element={<StanfordUniversity />} />
              <Route path="/schools/undergraduate-admissions/massachusetts-institute-of-technology-mit" element={<MITUniversity />} />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </HelmetProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
