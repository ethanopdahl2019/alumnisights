
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";

const PaymentSuccess = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }

    const fetchLatestBooking = async () => {
      try {
        const { data, error } = await supabase
          .from("bookings")
          .select(`
            id, 
            scheduled_at, 
            status,
            profile:profiles(id, name, image)
          `)
          .eq("user_id", user.id)
          .eq("status", "pending")
          .order("created_at", { ascending: false })
          .limit(1)
          .single();

        if (error) {
          console.error("Error fetching booking:", error);
          toast.error("Could not retrieve your booking information");
        } else if (data) {
          setBooking(data);
          // Update booking status to confirmed
          await supabase
            .from("bookings")
            .update({ status: "confirmed" })
            .eq("id", data.id);
        }
      } catch (error) {
        console.error("Error in booking process:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestBooking();
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Helmet>
        <title>Payment Successful | AlumniSights</title>
      </Helmet>
      
      <Navbar />
      
      <main className="flex-grow container-custom py-12 flex flex-col items-center justify-center">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto mb-4 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="text-green-600 w-7 h-7" />
            </div>
            <CardTitle className="text-2xl font-bold text-green-700">Payment Successful!</CardTitle>
          </CardHeader>
          
          <CardContent className="pt-6 space-y-6">
            <p className="text-center text-gray-600">
              Thank you for your booking. Your payment has been successfully processed.
            </p>
            
            {loading ? (
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-700"></div>
              </div>
            ) : booking ? (
              <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                <p className="font-medium">Booking Details:</p>
                <p className="text-sm text-gray-600 mt-2">
                  Session with {booking.profile?.name}
                </p>
                <p className="text-sm text-gray-600">
                  Date: {new Date(booking.scheduled_at).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-600">
                  Time: {new Date(booking.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            ) : (
              <p className="text-center text-gray-500 italic">Booking details not available</p>
            )}
            
            <div className="flex flex-col space-y-3 pt-4">
              <Button asChild>
                <Link to="/my-account">View My Bookings</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/">Back to Home</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
      
      <Footer />
    </div>
  );
};

export default PaymentSuccess;
