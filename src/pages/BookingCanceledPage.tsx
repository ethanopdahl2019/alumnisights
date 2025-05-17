
import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { toast } from "sonner";
import { AlertCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

const BookingCanceledPage = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const { user } = useAuth();
  
  useEffect(() => {
    const updateBooking = async () => {
      if (!user || !bookingId) return;
      
      try {
        const { error } = await supabase
          .from("bookings")
          .update({ status: "cancelled" })
          .eq("id", bookingId)
          .eq("user_id", user.id);

        if (error) throw error;
      } catch (error) {
        console.error("Error updating booking status:", error);
        toast.error("Could not update booking status");
      }
    };

    updateBooking();
  }, [bookingId, user]);

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container-custom py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white shadow-lg rounded-lg p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-red-100 p-3 rounded-full">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <h1 className="text-2xl font-semibold">Payment Canceled</h1>
            </div>
            
            <p className="text-gray-600 mb-6">
              Your booking has been canceled and no payment has been processed. 
              You can try again or choose a different time slot.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/browse" className="flex-1">
                <Button variant="default" className="w-full">
                  Browse Mentors
                </Button>
              </Link>
              <Link to="/student-dashboard" className="flex-1">
                <Button variant="outline" className="w-full">
                  Go to Dashboard
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

export default BookingCanceledPage;
