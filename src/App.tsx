
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import SchoolMajorLanding from "./pages/SchoolMajorLanding";
import SchoolActivityLanding from "./pages/SchoolActivityLanding";

// Import the new Insights pages
import UndergraduateAdmissions from "./pages/insights/UndergraduateAdmissions";
import GraduateAdmissions from "./pages/insights/GraduateAdmissions";
import IndustryInsights from "./pages/insights/IndustryInsights";
import ClubsAndGreekLife from "./pages/insights/ClubsAndGreekLife";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
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
            {/* Dashboards and alumni profiles */}
            <Route path="/alumni-dashboard" element={<AlumniDashboard />} />
            <Route path="/applicant-dashboard" element={<ApplicantDashboard />} />
            <Route path="/alumni/:id" element={<AlumniProfilePage />} />
            <Route path="/p/:slug" element={<LandingPage />} />
            {/* School x Major/Activity landing pages */}
            <Route path="/schools/:schoolId/majors/:majorId" element={<SchoolMajorLanding />} />
            <Route path="/schools/:schoolId/activities/:activityId" element={<SchoolActivityLanding />} />
            
            {/* New Insights routes */}
            <Route path="/insights/undergraduate-admissions" element={<UndergraduateAdmissions />} />
            <Route path="/insights/graduate-admissions" element={<GraduateAdmissions />} />
            <Route path="/insights/industry" element={<IndustryInsights />} />
            <Route path="/insights/clubs-and-greek-life" element={<ClubsAndGreekLife />} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
