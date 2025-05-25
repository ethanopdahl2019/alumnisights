
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/components/AuthProvider";
import Index from "./pages/Index";
import LandingPage from "./pages/LandingPage";
import AboutUs from "./pages/AboutUs";
import Browse from "./pages/Browse";
import BookingPage from "./pages/BookingPage";
import BookingSuccessPage from "./pages/BookingSuccessPage";
import HowItWorks from "./pages/HowItWorks";
import Careers from "./pages/Careers";
import Contact from "./pages/Contact";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Testimonials from "./pages/Testimonials";
import FAQ from "./pages/FAQ";
import SuccessStories from "./pages/SuccessStories";
import Resources from "./pages/Resources";
import Blog from "./pages/Blog";
import Auth from "./pages/Auth";
import BecomeMentor from "./pages/BecomeMentor";
import SchoolDetail from "./pages/SchoolDetail";
import Schools from "./pages/Schools";
import AlumniDashboard from "./pages/AlumniDashboard";
import AlumniProfilePage from "./pages/AlumniProfilePage";
import ApplicantDashboard from "./pages/ApplicantDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import MentorDashboard from "./pages/MentorDashboard";
import ProfileComplete from "./pages/ProfileComplete";
import MentorProfileComplete from "./pages/MentorProfileComplete";
import MyAccount from "./pages/MyAccount";
import UndergraduateAdmissions from "./pages/UndergraduateAdmissions";
import SchoolMajorLanding from "./pages/SchoolMajorLanding";
import SchoolActivityLanding from "./pages/SchoolActivityLanding";
import NotFound from "./pages/NotFound";
import MentorChat from "./pages/MentorChat";

// Admin pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import UserManagement from "./pages/admin/UserManagement";
import Analytics from "./pages/admin/Analytics";
import BookingManagement from "./pages/admin/BookingManagement";
import ContentProgress from "./pages/admin/ContentProgress";
import FeaturedSchools from "./pages/admin/FeaturedSchools";
import HomepageControl from "./pages/admin/HomepageControl";
import RegistrationControl from "./pages/admin/RegistrationControl";
import RequestManagement from "./pages/admin/RequestManagement";
import InformationListsManagement from "./pages/admin/InformationListsManagement";

// Insights pages
import UniversityAdmissions from "./pages/insights/UniversityAdmissions";
import GraduateAdmissions from "./pages/insights/GraduateAdmissions";
import IndustryInsights from "./pages/insights/IndustryInsights";
import ClubsAndGreekLife from "./pages/insights/ClubsAndGreekLife";

// University content pages
import UniversityContentManager from "./pages/insights/universities/UniversityContentManager";
import UniversityContentEditor from "./pages/insights/universities/UniversityContentEditor";
import UniversityPage from "./pages/insights/universities/UniversityPage";

// Individual university pages
import HarvardUniversity from "./pages/insights/universities/harvard-university";
import StanfordUniversity from "./pages/insights/universities/stanford-university";
import MITPage from "./pages/insights/universities/mit";
import AmherstCollege from "./pages/insights/universities/amherst-college";
import AlleghenyCollege from "./pages/insights/universities/allegheny-college";
import AmericanUniversity from "./pages/insights/universities/american-university";
import AppalachianStateUniversity from "./pages/insights/universities/appalachian-state-university";
import AuburnUniversity from "./pages/insights/universities/auburn-university";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/landing" element={<LandingPage />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/browse" element={<Browse />} />
              <Route path="/booking/:profileId" element={<BookingPage />} />
              <Route path="/booking-success" element={<BookingSuccessPage />} />
              <Route path="/how-it-works" element={<HowItWorks />} />
              <Route path="/careers" element={<Careers />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/testimonials" element={<Testimonials />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/success-stories" element={<SuccessStories />} />
              <Route path="/resources" element={<Resources />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/become-mentor" element={<BecomeMentor />} />
              <Route path="/school/:id" element={<SchoolDetail />} />
              <Route path="/schools" element={<Schools />} />
              <Route path="/alumni-dashboard" element={<AlumniDashboard />} />
              <Route path="/profile/:id" element={<AlumniProfilePage />} />
              <Route path="/applicant-dashboard" element={<ApplicantDashboard />} />
              <Route path="/student-dashboard" element={<StudentDashboard />} />
              <Route path="/mentor-dashboard" element={<MentorDashboard />} />
              <Route path="/profile-complete" element={<ProfileComplete />} />
              <Route path="/mentor-profile-complete" element={<MentorProfileComplete />} />
              <Route path="/my-account" element={<MyAccount />} />
              <Route path="/mentor-chat" element={<MentorChat />} />
              
              {/* Admin Routes */}
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<UserManagement />} />
              <Route path="/admin/analytics" element={<Analytics />} />
              <Route path="/admin/bookings" element={<BookingManagement />} />
              <Route path="/admin/content-progress" element={<ContentProgress />} />
              <Route path="/admin/featured-schools" element={<FeaturedSchools />} />
              <Route path="/admin/homepage-control" element={<HomepageControl />} />
              <Route path="/admin/registration-control" element={<RegistrationControl />} />
              <Route path="/admin/requests" element={<RequestManagement />} />
              <Route path="/admin/information-lists" element={<InformationListsManagement />} />
              
              {/* School-specific landing pages */}
              <Route path="/schools/:schoolSlug" element={<Schools />} />
              <Route path="/schools/:schoolSlug/:majorSlug" element={<SchoolMajorLanding />} />
              <Route path="/schools/:schoolSlug/activities/:activitySlug" element={<SchoolActivityLanding />} />
              <Route path="/undergraduate-admissions" element={<UndergraduateAdmissions />} />
              
              {/* Insights Routes */}
              <Route path="/insights/university-admissions" element={<UniversityAdmissions />} />
              <Route path="/insights/graduate-admissions" element={<GraduateAdmissions />} />
              <Route path="/insights/industry-insights" element={<IndustryInsights />} />
              <Route path="/insights/clubs-and-greek-life" element={<ClubsAndGreekLife />} />
              
              {/* University Content Management */}
              <Route path="/insights/university-content-manager" element={<UniversityContentManager />} />
              <Route path="/insights/university-content-editor/:universityId" element={<UniversityContentEditor />} />
              <Route path="/insights/universities/:universityId" element={<UniversityPage />} />
              
              {/* Individual University Pages */}
              <Route path="/insights/universities/harvard-university" element={<HarvardUniversity />} />
              <Route path="/insights/universities/stanford-university" element={<StanfordUniversity />} />
              <Route path="/insights/universities/mit" element={<MITPage />} />
              <Route path="/insights/universities/amherst-college" element={<AmherstCollege />} />
              <Route path="/insights/universities/allegheny-college" element={<AlleghenyCollege />} />
              <Route path="/insights/universities/american-university" element={<AmericanUniversity />} />
              <Route path="/insights/universities/appalachian-state-university" element={<AppalachianStateUniversity />} />
              <Route path="/insights/universities/auburn-university" element={<AuburnUniversity />} />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
