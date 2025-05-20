
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from '@/components/AuthProvider';
import Index from '@/pages/Index';
import NotFound from '@/pages/NotFound';
import AboutUs from '@/pages/AboutUs';
import Contact from '@/pages/Contact';
import FAQ from '@/pages/FAQ';
import Auth from '@/pages/Auth';
import StudentDashboard from '@/pages/StudentDashboard';
import ProfileComplete from '@/pages/ProfileComplete'; // Import the new page
import MentorDashboard from '@/pages/MentorDashboard';
import LandingPage from '@/pages/LandingPage';

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/student-dashboard" element={<StudentDashboard />} />
            <Route path="/profile-complete" element={<ProfileComplete />} />
            <Route path="/mentor-dashboard" element={<MentorDashboard />} />
            <Route path="/landing-page/:slug" element={<LandingPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
