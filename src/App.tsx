import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'sonner';

import AuthProvider from './components/AuthProvider';
import HomePage from './pages/HomePage';
import AlumniDirectoryPage from './pages/AlumniDirectoryPage';
import SchoolDirectoryPage from './pages/SchoolDirectoryPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';
import AuthPage from './pages/AuthPage';
import AccountPage from './pages/AccountPage';
import AlumniProfilePage from './pages/AlumniProfilePage';
import StudentDashboard from './pages/StudentDashboard';
import MentorDashboard from './pages/MentorDashboard';
import AdminDashboard from './pages/AdminDashboard';
import NotFoundPage from './pages/NotFoundPage';
import BlogPage from './pages/BlogPage';
import BlogPostPage from './pages/BlogPostPage';
import PricingPage from "./pages/PricingPage";
import UniversityPage from "./pages/UniversityPage";
import LandingPage from "./pages/LandingPage";
import MessagesPage from "./pages/MessagesPage";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/browse" element={<AlumniDirectoryPage />} />
              <Route path="/schools" element={<SchoolDirectoryPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/account" element={<AccountPage />} />
              <Route path="/alumni/:id" element={<AlumniProfilePage />} />
              <Route path="/alumni-dashboard" element={<MentorDashboard />} />
              <Route path="/student-dashboard" element={<StudentDashboard />} />
              <Route path="/mentor-dashboard" element={<MentorDashboard />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/blog/:slug" element={<BlogPostPage />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/university/:universityName" element={<UniversityPage />} />
              <Route path="/page/:slug" element={<LandingPage />} />
              
              {/* Add new routes for messaging */}
              <Route path="/messages" element={<MessagesPage />} />
              <Route path="/messages/:id" element={<MessagesPage />} />
              
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
            <Toaster position="bottom-right" />
          </AuthProvider>
        </BrowserRouter>
      </HelmetProvider>
    </QueryClientProvider>
  );
}

export default App;
