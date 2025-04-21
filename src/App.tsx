
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthProvider from "@/components/AuthProvider";
import Index from "./pages/Index";
import Browse from "./pages/Browse";
import Profile from "./pages/Profile";
import Blog from "./pages/Blog";
import HowItWorksPage from "./pages/HowItWorksPage";
import NotFound from "./pages/NotFound";
import BlogPost from "./pages/BlogPost";
import LandingPage from "./pages/LandingPage";
import Auth from "./pages/Auth";
import ProfileComplete from "./pages/ProfileComplete";
import Schools from "./pages/Schools";
import SchoolDetail from "./pages/SchoolDetail";
import AlumniDashboard from "./pages/AlumniDashboard";
import ApplicantDashboard from "./pages/ApplicantDashboard";
import Messages from "./pages/Messages";

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
            <Route path="/profile/:id" element={<Profile />} />
            <Route path="/profile/complete" element={<ProfileComplete />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/p/:slug" element={<LandingPage />} />
            <Route path="/schools" element={<Schools />} />
            <Route path="/schools/:id" element={<SchoolDetail />} />
            <Route path="/how-it-works" element={<HowItWorksPage />} />
            <Route path="/alumni-dashboard" element={<AlumniDashboard />} />
            <Route path="/applicant-dashboard" element={<ApplicantDashboard />} />
            <Route path="/messages/:conversationId" element={<Messages />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
