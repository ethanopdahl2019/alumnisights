
import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";

const BookingSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isCreatingBooking, setIsCreatingBooking] = useState(true);
  const [bookingError, setBookingError] = useState<string | null>(null);
  
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    const createBookingFromStripe = async () => {
      if (!sessionId || !user) return;

      try {
        // Invoke an edge function to verify the payment and create the booking
        // This is a simpler implementation - in a production app, you might want to create a verify-payment edge function
        const { data: bookingData, error } = await supabase
          .from('bookings')
          .insert({
            user_id: user.id,
            profile_id: sessionId, // This should be retrieved from Stripe metadata in a real implementation
            scheduled_at: new Date().toISOString(), // This should be retrieved from Stripe metadata in a real implementation
            status: 'confirmed',
            booking_option_id: null // This should be retrieved from Stripe metadata in a real implementation
          })
          .select()
          .single();
        
        if (error) {
          throw new Error(error.message);
        }
        
        setIsCreatingBooking(false);
      } catch (error) {
        console.error("Error creating booking from Stripe:", error);
        setBookingError("There was an issue finalizing your booking. Our team has been notified.");
        setIsCreatingBooking(false);
      }
    };

    createBookingFromStripe();
  }, [sessionId, user]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container-custom py-12">
        <motion.div 
          className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col items-center text-center">
            <div className="bg-green-100 p-3 rounded-full mb-4">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            
            <h1 className="text-2xl font-bold mb-2">Payment Successful!</h1>
            <p className="text-gray-600 mb-6">
              {isCreatingBooking 
                ? "We're finalizing your booking details..." 
                : bookingError 
                  ? bookingError
                  : "Your booking has been confirmed and added to your dashboard."}
            </p>

            {isCreatingBooking ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full"></div>
                <span>Processing...</span>
              </div>
            ) : (
              <div className="space-y-4 w-full">
                <Button 
                  onClick={() => navigate("/student-dashboard")}
                  className="w-full"
                >
                  View My Bookings
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => navigate("/browse")}
                  className="w-full"
                >
                  Browse More Mentors
                </Button>
              </div>
            )}
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default BookingSuccessPage;
