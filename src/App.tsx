import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "@/components/ui/toaster";
import { PHProvider } from "@/lib/phonetic-avatar/provider";
import Browse from "./pages/Browse";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import Auth from "./pages/Auth";
import StudentDashboard from "./pages/StudentDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import BookingManagement from "./pages/admin/BookingManagement";
import SchoolManagement from "./pages/admin/SchoolManagement";
import SchoolPage from "./pages/SchoolPage";
import { AuthProvider } from "./components/AuthProvider";
import BookingPage from "./pages/BookingPage";
import BookingSuccessPage from "./pages/BookingSuccessPage";
import BookingCanceledPage from "./pages/BookingCanceledPage";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <AuthProvider>
          <ThemeProvider defaultTheme="light" storageKey="theme">
            <PHProvider>
              <RouterProvider router={router} />
              <Toaster />
            </PHProvider>
          </ThemeProvider>
        </AuthProvider>
      </HelmetProvider>
    </QueryClientProvider>
  );
}

// Create router
const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/browse",
    element: <Browse />,
  },
  {
    path: "/profile/:id",
    element: <Profile />,
  },
  {
    path: "/profile/edit/:id",
    element: <EditProfile />,
  },
  {
    path: "/auth",
    element: <Auth />,
  },
  {
    path: "/student-dashboard",
    element: <StudentDashboard />,
  },
  {
    path: "/admin/dashboard",
    element: <AdminDashboard />,
  },
  {
    path: "/admin/bookings",
    element: <BookingManagement />,
  },
  {
    path: "/admin/schools",
    element: <SchoolManagement />,
  },
  {
    path: "/schools",
    element: <SchoolPage />,
  },
  {
    path: "/booking/:id/:productId",
    element: <BookingPage />
  },
  {
    path: "/booking-success/:bookingId",
    element: <BookingSuccessPage />
  },
  {
    path: "/booking-canceled/:bookingId",
    element: <BookingCanceledPage />
  },
]);

export default App;
