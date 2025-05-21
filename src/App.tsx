import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import "./App.css";
import Index from "./pages/Index";
import { AuthProvider } from './components/AuthProvider';
import { Toaster } from './components/ui/sonner';
import ErrorLoggerProvider from './components/ErrorLoggerProvider';
import SimpleProfileComplete from './pages/SimpleProfileComplete';
import MyAccount from './pages/MyAccount';
import Browse from './pages/Browse';
import ApplicantDashboard from './pages/ApplicantDashboard';
import MentorDashboard from './pages/MentorDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import UniversityContentManager from './pages/insights/universities/UniversityContentManager';
import UniversityContentEditor from './pages/insights/universities/UniversityContentEditor';
import NotFound from './pages/NotFound';
import PasswordReset from './pages/PasswordReset';
import Blog from './pages/insights/blog/Blog';
import BlogPost from './pages/insights/blog/BlogPost';
import BlogCategoryPage from './pages/insights/blog/BlogCategoryPage';
import LandingPage from './pages/LandingPage';
import UniversityLandingPage from './pages/UniversityLandingPage';
import MajorLandingPage from './pages/MajorLandingPage';
import Pricing from './pages/Pricing';

function App() {
  return (
    <ErrorLoggerProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/complete-profile" element={<SimpleProfileComplete />} />
            <Route path="/my-account" element={<MyAccount />} />
            <Route path="/browse" element={<Browse />} />
            <Route path="/applicant-dashboard" element={<ApplicantDashboard />} />
            <Route path="/mentor-dashboard" element={<MentorDashboard />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/user-management" element={<UserManagement />} />
            <Route path="/insights/university-content-manager" element={<UniversityContentManager />} />
            <Route path="/insights/university-content-editor/:universityId" element={<UniversityContentEditor />} />
            <Route path="/password-reset" element={<PasswordReset />} />
            
            {/* Blog Routes */}
            <Route path="/insights/blog" element={<Blog />} />
            <Route path="/insights/blog/:slug" element={<BlogPost />} />
            <Route path="/insights/blog/category/:slug" element={<BlogCategoryPage />} />

            {/* Landing Pages */}
            <Route path="/landing/:slug" element={<LandingPage />} />
            <Route path="/university/:slug" element={<UniversityLandingPage />} />
            <Route path="/major/:slug" element={<MajorLandingPage />} />

            {/* Pricing */}
            <Route path="/pricing" element={<Pricing />} />
            
            {/* Not Found Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </Router>
      </AuthProvider>
    </ErrorLoggerProvider>
  );
}

export default App;
