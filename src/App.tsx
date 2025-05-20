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
import Profile from '@/pages/Profile';
import Insights from '@/pages/Insights';
import Universities from '@/pages/insights/universities/Universities';
import Majors from '@/pages/insights/majors/Majors';
import Activities from '@/pages/insights/activities/Activities';
import Blog from '@/pages/blog/Blog';
import BlogPost from '@/pages/blog/BlogPost';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import AdminUsers from '@/pages/admin/AdminUsers';
import AdminSchools from '@/pages/admin/AdminSchools';
import AdminMajors from '@/pages/admin/AdminMajors';
import AdminActivities from '@/pages/admin/AdminActivities';
import AdminBlogPosts from '@/pages/admin/AdminBlogPosts';
import AdminBlogCategories from '@/pages/admin/AdminBlogCategories';
import AdminSiteSettings from '@/pages/admin/AdminSiteSettings';
import Bookings from '@/pages/Bookings';
import Messages from '@/pages/Messages';
import LandingPage from '@/pages/LandingPage';
import UniversityLandingPage from '@/pages/UniversityLandingPage';
import MajorLandingPage from '@/pages/MajorLandingPage';

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
            <Route path="/profile-complete" element={<ProfileComplete />} /> {/* Add the new route */}
            <Route path="/mentor-dashboard" element={<MentorDashboard />} />
            <Route path="/profile/:profileId" element={<Profile />} />
            <Route path="/insights" element={<Insights />} />
            <Route path="/insights/universities" element={<Universities />} />
            <Route path="/insights/majors" element={<Majors />} />
            <Route path="/insights/activities" element={<Activities />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/schools" element={<AdminSchools />} />
            <Route path="/admin/majors" element={<AdminMajors />} />
            <Route path="/admin/activities" element={<AdminActivities />} />
            <Route path="/admin/blog-posts" element={<AdminBlogPosts />} />
            <Route path="/admin/blog-categories" element={<AdminBlogCategories />} />
            <Route path="/admin/site-settings" element={<AdminSiteSettings />} />

            <Route path="/bookings" element={<Bookings />} />
            <Route path="/messages" element={<Messages />} />

            {/* Landing Pages */}
            <Route path="/landing-page/:slug" element={<LandingPage />} />
            <Route path="/university/:slug" element={<UniversityLandingPage />} />
            <Route path="/major/:slug" element={<MajorLandingPage />} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
