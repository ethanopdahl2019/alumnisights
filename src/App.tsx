
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import Index from './pages/Index';
import LandingPage from './pages/LandingPage';
import Browse from './pages/Browse';
import BookingPage from './pages/BookingPage';
import StudentDashboard from './pages/StudentDashboard';
import ApplicantDashboard from './pages/ApplicantDashboard';
import MentorDashboard from './pages/MentorDashboard';
import AlumniDashboard from './pages/AlumniDashboard';
import Auth from './pages/Auth';
import AlumniProfilePage from './pages/AlumniProfilePage';
import ProfileComplete from './pages/ProfileComplete';
import MyAccount from './pages/MyAccount';
import Schools from './pages/Schools';
import SchoolDetail from './pages/SchoolDetail';
import SchoolActivityLanding from './pages/SchoolActivityLanding';
import SchoolMajorLanding from './pages/SchoolMajorLanding';
import UndergraduateAdmissions from './pages/UndergraduateAdmissions';
import UniversityAdmissions from './pages/insights/UniversityAdmissions';
import UniversityPage from './pages/insights/universities/UniversityPage';
import UniversityContentEditor from './pages/insights/universities/UniversityContentEditor';
import UniversityContentManager from './pages/insights/universities/UniversityContentManager';
import UniversityBulkContentGenerator from './pages/insights/universities/UniversityBulkContentGenerator';
import AboutUs from './pages/AboutUs';
import Resources from './pages/Resources';
import FAQ from './pages/FAQ';
import HowItWorks from './pages/HowItWorks';
import Testimonials from './pages/Testimonials';
import Blog from './pages/Blog';
import Careers from './pages/Careers';
import Contact from './pages/Contact';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import BecomeMentor from './pages/BecomeMentor';
import SuccessStories from './pages/SuccessStories';
import NotFound from './pages/NotFound';
import TestErrorBoundary from './components/TestErrorBoundary';

function App() {
  console.log('App rendering');
  return (
    <div>
      <Toaster position="top-center" richColors closeButton />
      <Routes>
        <Route path="/" element={
          <TestErrorBoundary label="Index">
            <Index />
          </TestErrorBoundary>
        } />
        <Route path="/landing-page" element={
          <TestErrorBoundary label="LandingPage">
            <LandingPage />
          </TestErrorBoundary>
        } />
        <Route path="/browse" element={
          <TestErrorBoundary label="Browse">
            <Browse />
          </TestErrorBoundary>
        } />
        <Route path="/booking/:profileId" element={
          <TestErrorBoundary label="BookingPage">
            <BookingPage />
          </TestErrorBoundary>
        } />
        <Route path="/student-dashboard" element={
          <TestErrorBoundary label="StudentDashboard">
            <StudentDashboard />
          </TestErrorBoundary>
        } />
        <Route path="/applicant-dashboard" element={
          <TestErrorBoundary label="ApplicantDashboard">
            <ApplicantDashboard />
          </TestErrorBoundary>
        } />
        <Route path="/mentor-dashboard" element={
          <TestErrorBoundary label="MentorDashboard">
            <MentorDashboard />
          </TestErrorBoundary>
        } />
        <Route path="/alumni-dashboard" element={
          <TestErrorBoundary label="AlumniDashboard">
            <AlumniDashboard />
          </TestErrorBoundary>
        } />
        <Route path="/auth" element={
          <TestErrorBoundary label="Auth">
            <Auth />
          </TestErrorBoundary>
        } />
        <Route path="/alumni/:id" element={
          <TestErrorBoundary label="AlumniProfilePage">
            <AlumniProfilePage />
          </TestErrorBoundary>
        } />
        <Route path="/profile-complete" element={
          <TestErrorBoundary label="ProfileComplete">
            <ProfileComplete />
          </TestErrorBoundary>
        } />
        <Route path="/my-account" element={
          <TestErrorBoundary label="MyAccount">
            <MyAccount />
          </TestErrorBoundary>
        } />
        <Route path="/schools" element={
          <TestErrorBoundary label="Schools">
            <Schools />
          </TestErrorBoundary>
        } />
        <Route path="/school/:id" element={
          <TestErrorBoundary label="SchoolDetail">
            <SchoolDetail />
          </TestErrorBoundary>
        } />
        <Route path="/schools/activities/:id" element={
          <TestErrorBoundary label="SchoolActivityLanding">
            <SchoolActivityLanding />
          </TestErrorBoundary>
        } />
        <Route path="/schools/majors/:id" element={
          <TestErrorBoundary label="SchoolMajorLanding">
            <SchoolMajorLanding />
          </TestErrorBoundary>
        } />
        <Route path="/schools/undergraduate-admissions" element={
          <TestErrorBoundary label="UndergraduateAdmissions">
            <UndergraduateAdmissions />
          </TestErrorBoundary>
        } />
        <Route path="/insights/undergraduate-admissions" element={
          <TestErrorBoundary label="UndergraduateAdmissions">
            <UndergraduateAdmissions />
          </TestErrorBoundary>
        } />
        <Route path="/insights/undergraduate-admissions/:id" element={
          <TestErrorBoundary label="UniversityAdmissions">
            <UniversityAdmissions />
          </TestErrorBoundary>
        } />
        <Route path="/insights/university-page/:id" element={
          <TestErrorBoundary label="UniversityPage">
            <UniversityPage />
          </TestErrorBoundary>
        } />
        <Route path="/insights/university-content-editor/:id" element={
          <TestErrorBoundary label="UniversityContentEditorWithId">
            <UniversityContentEditor />
          </TestErrorBoundary>
        } />
        <Route path="/insights/university-content-editor" element={
          <TestErrorBoundary label="UniversityContentEditor">
            <UniversityContentEditor />
          </TestErrorBoundary>
        } />
        <Route path="/insights/universities/content-manager" element={
          <TestErrorBoundary label="UniversityContentManager">
            <UniversityContentManager />
          </TestErrorBoundary>
        } />
        <Route path="/insights/universities/bulk-content-generator" element={
          <TestErrorBoundary label="UniversityBulkContentGenerator">
            <UniversityBulkContentGenerator />
          </TestErrorBoundary>
        } />
        <Route path="/about-us" element={
          <TestErrorBoundary label="AboutUs">
            <AboutUs />
          </TestErrorBoundary>
        } />
        <Route path="/resources" element={
          <TestErrorBoundary label="Resources">
            <Resources />
          </TestErrorBoundary>
        } />
        <Route path="/faq" element={
          <TestErrorBoundary label="FAQ">
            <FAQ />
          </TestErrorBoundary>
        } />
        <Route path="/how-it-works" element={
          <TestErrorBoundary label="HowItWorks">
            <HowItWorks />
          </TestErrorBoundary>
        } />
        <Route path="/testimonials" element={
          <TestErrorBoundary label="Testimonials">
            <Testimonials />
          </TestErrorBoundary>
        } />
        <Route path="/blog" element={
          <TestErrorBoundary label="Blog">
            <Blog />
          </TestErrorBoundary>
        } />
        <Route path="/careers" element={
          <TestErrorBoundary label="Careers">
            <Careers />
          </TestErrorBoundary>
        } />
        <Route path="/contact" element={
          <TestErrorBoundary label="Contact">
            <Contact />
          </TestErrorBoundary>
        } />
        <Route path="/privacy" element={
          <TestErrorBoundary label="Privacy">
            <Privacy />
          </TestErrorBoundary>
        } />
        <Route path="/terms" element={
          <TestErrorBoundary label="Terms">
            <Terms />
          </TestErrorBoundary>
        } />
        <Route path="/become-mentor" element={
          <TestErrorBoundary label="BecomeMentor">
            <BecomeMentor />
          </TestErrorBoundary>
        } />
        <Route path="/success-stories" element={
          <TestErrorBoundary label="SuccessStories">
            <SuccessStories />
          </TestErrorBoundary>
        } />
        <Route path="*" element={
          <TestErrorBoundary label="NotFound">
            <NotFound />
          </TestErrorBoundary>
        } />
      </Routes>
    </div>
  );
}

export default App;
