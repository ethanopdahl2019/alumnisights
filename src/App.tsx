import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import "./App.css";

// Import pages
import HomePage from "./pages/Index";
import BrowsePage from "./pages/Browse";
import AlumniProfilePage from "./pages/AlumniProfilePage";
import MyAccount from "./pages/MyAccount";
import MentorDashboard from "./pages/MentorDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import BookingPage from "./pages/BookingPage";
import AuthPage from "./pages/Auth";
import RegistrationPage from "./pages/BecomeMentor";
import BlogPage from "./pages/Blog";
import BlogPostPage from "./pages/Blog";
import UniversityPage from "./pages/SchoolDetail";
import PrivacyPolicyPage from "./pages/Privacy";
import TermsOfServicePage from "./pages/Terms";
import ContactPage from "./pages/Contact";
import AboutUsPage from "./pages/AboutUs";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentCanceled from "./pages/PaymentCanceled";
import MessagingPage from "./pages/MessagingPage";
import ConversationPage from "./pages/ConversationPage";

import AuthProvider from "./components/AuthProvider";
import { Toaster } from "@/components/ui/sonner";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/browse",
    element: <BrowsePage />,
  },
  {
    path: "/profile/:id",
    element: <AlumniProfilePage />,
  },
  {
    path: "/booking/:id/:productId",
    element: <BookingPage />,
  },
  {
    path: "/auth",
    element: <AuthPage />,
  },
  {
    path: "/register",
    element: <RegistrationPage />,
  },
  {
    path: "/my-account",
    element: <MyAccount />,
  },
  {
    path: "/mentor/dashboard",
    element: <MentorDashboard />,
  },
  {
    path: "/admin/dashboard",
    element: <AdminDashboard />,
  },
  {
    path: "/blog",
    element: <BlogPage />,
  },
  {
    path: "/blog/:slug",
    element: <BlogPostPage />,
  },
  {
    path: "/university/:name",
    element: <UniversityPage />,
  },
  {
    path: "/privacy-policy",
    element: <PrivacyPolicyPage />,
  },
  {
    path: "/terms-of-service",
    element: <TermsOfServicePage />,
  },
  {
    path: "/contact",
    element: <ContactPage />,
  },
  {
    path: "/about",
    element: <AboutUsPage />,
  },
  {
    path: "/payment-success",
    element: <PaymentSuccess />,
  },
  {
    path: "/payment-canceled",
    element: <PaymentCanceled />,
  },
  // Messaging routes
  {
    path: "/messaging",
    element: <MessagingPage />,
  },
  {
    path: "/messaging/conversation/:id",
    element: <ConversationPage />,
  },
]);

function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <RouterProvider router={router} />
          <Toaster />
        </AuthProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;
