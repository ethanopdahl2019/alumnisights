
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "@/components/ui/toaster";
import Browse from "./pages/Browse";
import Auth from "./pages/Auth";
import StudentDashboard from "./pages/StudentDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import BookingManagement from "./pages/admin/BookingManagement";
import BookingPage from "./pages/BookingPage";
import BookingSuccessPage from "./pages/BookingSuccessPage";
import BookingCanceledPage from "./pages/BookingCanceledPage";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <RouterProvider router={router} />
        <Toaster />
      </HelmetProvider>
    </QueryClientProvider>
  );
}

// Create router
const router = createBrowserRouter([
  {
    path: "/",
    element: <Browse />,
  },
  {
    path: "/browse",
    element: <Browse />,
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
