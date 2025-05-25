
import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import AuthProvider from "./components/AuthProvider";

const Index = lazy(() => import("./pages/Index"));
const Auth = lazy(() => import("./pages/Auth"));
const ProfileComplete = lazy(() => import("./pages/ProfileComplete"));
const MentorProfileComplete = lazy(() => import("./pages/MentorProfileComplete"));
const Browse = lazy(() => import("./pages/Browse"));
const AlumniProfilePage = lazy(() => import("./pages/AlumniProfilePage"));
const BookingPage = lazy(() => import("./pages/BookingPage"));
const BookingSuccessPage = lazy(() => import("./pages/BookingSuccessPage"));
const StudentDashboard = lazy(() => import("./pages/StudentDashboard"));
const AlumniDashboard = lazy(() => import("./pages/AlumniDashboard"));
const ApplicantDashboard = lazy(() => import("./pages/ApplicantDashboard"));
const MentorDashboard = lazy(() => import("./pages/MentorDashboard"));
const MentorChat = lazy(() => import("./pages/MentorChat"));
const MyAccount = lazy(() => import("./pages/MyAccount"));
const BecomeMentor = lazy(() => import("./pages/BecomeMentor"));
const AboutUs = lazy(() => import("./pages/AboutUs"));
const FAQ = lazy(() => import("./pages/FAQ"));
const Contact = lazy(() => import("./pages/Contact"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Terms = lazy(() => import("./pages/Terms"));
const HowItWorks = lazy(() => import("./pages/HowItWorks"));
const Schools = lazy(() => import("./pages/Schools"));
const SchoolDetail = lazy(() => import("./pages/SchoolDetail"));
const Blog = lazy(() => import("./pages/Blog"));
const Resources = lazy(() => import("./pages/Resources"));
const Testimonials = lazy(() => import("./pages/Testimonials"));
const SuccessStories = lazy(() => import("./pages/SuccessStories"));
const Careers = lazy(() => import("./pages/Careers"));
const NotFound = lazy(() => import("./pages/NotFound"));
const LandingPage = lazy(() => import("./pages/LandingPage"));
const SchoolMajorLanding = lazy(() => import("./pages/SchoolMajorLanding"));
const SchoolActivityLanding = lazy(() => import("./pages/SchoolActivityLanding"));

// Insights pages
const UniversityAdmissions = lazy(() => import("./pages/insights/UniversityAdmissions"));
const UndergraduateAdmissions = lazy(() => import("./pages/insights/UndergraduateAdmissions"));
const GraduateAdmissions = lazy(() => import("./pages/insights/GraduateAdmissions"));
const ClubsAndGreekLife = lazy(() => import("./pages/insights/ClubsAndGreekLife"));
const IndustryInsights = lazy(() => import("./pages/insights/IndustryInsights"));

// University management pages
const UniversityContentManager = lazy(() => import("./pages/insights/universities/UniversityContentManager"));
const UniversityContentEditor = lazy(() => import("./pages/insights/universities/UniversityContentEditor"));
const UniversityPage = lazy(() => import("./pages/insights/universities/UniversityPage"));

// Admin pages
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const UserManagement = lazy(() => import("./pages/admin/UserManagement"));
const BookingManagement = lazy(() => import("./pages/admin/BookingManagement"));
const Analytics = lazy(() => import("./pages/admin/Analytics"));
const ContentProgress = lazy(() => import("./pages/admin/ContentProgress"));
const FeaturedSchools = lazy(() => import("./pages/admin/FeaturedSchools"));
const RequestManagement = lazy(() => import("./pages/admin/RequestManagement"));
const RegistrationControl = lazy(() => import("./pages/admin/RegistrationControl"));
const HomepageControl = lazy(() => import("./pages/admin/HomepageControl"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Suspense fallback={<div>Loading...</div>}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/profile-complete" element={<ProfileComplete />} />
                <Route path="/mentor-profile-complete" element={<MentorProfileComplete />} />
                <Route path="/browse" element={<Browse />} />
                <Route path="/alumni/:id" element={<AlumniProfilePage />} />
                <Route path="/booking/:id" element={<BookingPage />} />
                <Route path="/booking-success" element={<BookingSuccessPage />} />
                <Route path="/student-dashboard" element={<StudentDashboard />} />
                <Route path="/alumni-dashboard" element={<AlumniDashboard />} />
                <Route path="/applicant-dashboard" element={<ApplicantDashboard />} />
                <Route path="/mentor-dashboard" element={<MentorDashboard />} />
                <Route path="/mentor-chat" element={<MentorChat />} />
                <Route path="/my-account" element={<MyAccount />} />
                <Route path="/become-mentor" element={<BecomeMentor />} />
                <Route path="/about" element={<AboutUs />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/how-it-works" element={<HowItWorks />} />
                <Route path="/schools" element={<Schools />} />
                <Route path="/schools/:id" element={<SchoolDetail />} />
                <Route path="/schools/undergraduate-admissions/:id" element={<UniversityPage />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/resources" element={<Resources />} />
                <Route path="/testimonials" element={<Testimonials />} />
                <Route path="/success-stories" element={<SuccessStories />} />
                <Route path="/careers" element={<Careers />} />
                <Route path="/landing/:slug" element={<LandingPage />} />
                <Route path="/schools/:school/majors/:major" element={<SchoolMajorLanding />} />
                <Route path="/schools/:school/activities/:activity" element={<SchoolActivityLanding />} />
                
                {/* Insights routes */}
                <Route path="/insights/university-admissions" element={<UniversityAdmissions />} />
                <Route path="/insights/undergraduate-admissions" element={<UndergraduateAdmissions />} />
                <Route path="/insights/undergraduate-admissions/:id" element={<UniversityPage />} />
                <Route path="/insights/graduate-admissions" element={<GraduateAdmissions />} />
                <Route path="/insights/clubs-and-greek-life" element={<ClubsAndGreekLife />} />
                <Route path="/insights/industry-insights" element={<IndustryInsights />} />
                
                {/* University routes - Fixed routing */}
                <Route path="/insights/universities/:universityId" element={<UniversityPage />} />
                <Route path="/universities/:universityId" element={<UniversityPage />} />
                
                {/* University management routes */}
                <Route path="/insights/university-content-manager" element={<UniversityContentManager />} />
                <Route path="/insights/university-content-editor/:id" element={<UniversityContentEditor />} />
                <Route path="/universities/manage" element={<UniversityContentManager />} />
                
                {/* Admin routes */}
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/users" element={<UserManagement />} />
                <Route path="/admin/bookings" element={<BookingManagement />} />
                <Route path="/admin/analytics" element={<Analytics />} />
                <Route path="/admin/content-progress" element={<ContentProgress />} />
                <Route path="/admin/featured-schools" element={<FeaturedSchools />} />
                <Route path="/admin/requests" element={<RequestManagement />} />
                <Route path="/admin/registration-control" element={<RegistrationControl />} />
                <Route path="/admin/homepage-control" element={<HomepageControl />} />
                
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;
