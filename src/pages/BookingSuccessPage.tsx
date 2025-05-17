
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { toast } from "sonner";
import { Check } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

interface Booking {
  id: string;
  profile_id: string;
  scheduled_at: string;
  status: string;
  profile: {
    name: string;
    image: string;
  };
}

const BookingSuccessPage = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const { user } = useAuth();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBooking = async () => {
      if (!user || !bookingId) return;
      
      try {
        const { data, error } = await supabase
          .from("bookings")
          .select(`
            id,
            profile_id,
            scheduled_at,
            status,
            profiles:profile_id (
              name,
              image
            )
          `)
          .eq("id", bookingId)
          .eq("user_id", user.id)
          .single();

        if (error) throw error;
        
        // Transform the data to match our Booking interface
        const transformedData: Booking = {
          id: data.id,
          profile_id: data.profile_id,
          scheduled_at: data.scheduled_at,
          status: data.status,
          profile: data.profiles,
        };
        
        setBooking(transformedData);

        // Update the booking status to confirmed
        if (data.status === "pending") {
          await supabase
            .from("bookings")
            .update({ status: "confirmed" })
            .eq("id", bookingId);
        }
      } catch (error) {
        console.error("Error fetching booking:", error);
        toast.error("Could not retrieve booking information");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBooking();
  }, [bookingId, user]);

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="container-custom py-8 text-center">
          <div className="animate-pulse">
            <div className="h-32 bg-gray-200 rounded-lg mb-6"></div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="container-custom py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Booking Not Found</h1>
          <p className="mb-6">We couldn't find the booking information you requested.</p>
          <Link to="/student-dashboard">
            <Button>Go to Dashboard</Button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container-custom py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white shadow-lg rounded-lg p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-green-100 p-3 rounded-full">
                <Check className="h-6 w-6 text-green-600" />
              </div>
              <h1 className="text-2xl font-semibold">Payment Successful!</h1>
            </div>
            
            <div className="border-t border-b py-6 my-6">
              <h2 className="text-lg font-medium mb-4">Booking Details</h2>
              
              <div className="grid gap-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Session with:</span>
                  <span className="font-medium">{booking.profile.name}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Date:</span>
                  <span className="font-medium">{format(new Date(booking.scheduled_at), "MMMM d, yyyy")}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Time:</span>
                  <span className="font-medium">{format(new Date(booking.scheduled_at), "h:mm aa")}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="font-medium text-green-600">Confirmed</span>
                </div>
              </div>
            </div>
            
            <p className="text-gray-600 mb-6">
              We've sent a confirmation email with all the details of your booking. 
              You can also view all your bookings in your dashboard.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/student-dashboard" className="flex-1">
                <Button variant="default" className="w-full">
                  Go to Dashboard
                </Button>
              </Link>
              <Link to="/browse" className="flex-1">
                <Button variant="outline" className="w-full">
                  Browse More Mentors
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BookingSuccessPage;
