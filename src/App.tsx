
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

function App() {
  console.log('App rendering');
  return (
    <div>
      <Toaster position="top-center" richColors closeButton />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/landing-page" element={<LandingPage />} />
        <Route path="/browse" element={<Browse />} />
        <Route path="/booking/:profileId" element={<BookingPage />} />
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route path="/applicant-dashboard" element={<ApplicantDashboard />} />
        <Route path="/mentor-dashboard" element={<MentorDashboard />} />
        <Route path="/alumni-dashboard" element={<AlumniDashboard />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/alumni/:id" element={<AlumniProfilePage />} />
        <Route path="/profile-complete" element={<ProfileComplete />} />
        <Route path="/my-account" element={<MyAccount />} />
        <Route path="/schools" element={<Schools />} />
        <Route path="/school/:id" element={<SchoolDetail />} />
        <Route path="/schools/activities/:id" element={<SchoolActivityLanding />} />
        <Route path="/schools/majors/:id" element={<SchoolMajorLanding />} />
        <Route path="/schools/undergraduate-admissions" element={<UndergraduateAdmissions />} />
        <Route path="/insights/undergraduate-admissions" element={<UndergraduateAdmissions />} />
        <Route path="/insights/undergraduate-admissions/:id" element={<UniversityAdmissions />} />
        <Route path="/insights/university-page/:id" element={<UniversityPage />} />
        <Route path="/insights/university-content-editor/:id" element={<UniversityContentEditor />} />
        <Route path="/insights/university-content-editor" element={<UniversityContentEditor />} />
        <Route path="/insights/universities/content-manager" element={<UniversityContentManager />} />
        <Route path="/insights/universities/bulk-content-generator" element={<UniversityBulkContentGenerator />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/testimonials" element={<Testimonials />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/become-mentor" element={<BecomeMentor />} />
        <Route path="/success-stories" element={<SuccessStories />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
