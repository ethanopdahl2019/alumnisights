
import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { getProfileById } from "@/services/profiles";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Import refactored components
import BookingHeader from "@/components/booking/BookingHeader";
import DateTimePicker from "@/components/booking/DateTimePicker";
import BookingSummary from "@/components/booking/BookingSummary";
import BookingConfirmationDialog from "@/components/booking/BookingConfirmationDialog";

const BookingPage = () => {
  const { id, productId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [bookingZoomLink, setBookingZoomLink] = useState<string | null>(null);
  
  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile', id],
    queryFn: () => getProfileById(id!),
    enabled: !!id
  });
  
  // Mock available times - in a real app, these would come from the mentor's availability
  const availableTimes = [
    '9:00 AM', '10:00 AM', '11:00 AM', 
    '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'
  ];
  
  // Find the selected product based on the URL parameter
  const selectedProduct = profile?.price_15_min && productId === 'quick-chat' 
    ? { title: "Quick Chat", price: profile.price_15_min, duration: "15 minutes", id: "quick-chat" }
    : profile?.price_30_min && productId === 'deep-dive'
    ? { title: "Deep Dive", price: profile.price_30_min, duration: "30 minutes", id: "deep-dive" }
    : profile?.price_60_min && productId === 'comprehensive'
    ? { title: "Comprehensive Session", price: profile.price_60_min, duration: "60 minutes", id: "comprehensive" }
    : null;
  
  // Determine which days should be disabled (example: past dates and weekends)
  const isDateDisabled = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Disable past dates
    if (date < today) return true;
    
    // Example: Disable weekends (0 is Sunday, 6 is Saturday)
    const day = date.getDay();
    return day === 0 || day === 6;
  };
  
  const handleConfirmBooking = async () => {
    if (!selectedDate || !selectedTime) {
      // Fix: Using toast without title property
      toast.error("Please select a date and time");
      return;
    }
    
    if (!user) {
      // Fix: Using toast without title property
      toast.error("You must be logged in to book a session");
      return;
    }
    
    setIsProcessing(true);

    try {
      // Create a Stripe Checkout session
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: {
          profileId: id,
          productId: selectedProduct?.id,
          selectedDate: selectedDate.toISOString(),
          selectedTime: selectedTime,
          userId: user.id
        }
      });

      if (error) {
        throw new Error(error.message);
      }
      
      if (!data.checkoutUrl) {
        throw new Error("No checkout URL returned");
      }
      
      // Redirect to Stripe checkout
      window.location.href = data.checkoutUrl;
      
    } catch (error) {
      console.error('Error creating payment session:', error);
      toast.error('There was an issue processing your payment. Please try again.');
      setIsProcessing(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="container-custom py-8">
          <div className="animate-pulse">
            <div className="h-32 bg-gray-200 rounded-lg mb-6"></div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  if (!profile || !selectedProduct) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="container-custom py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Product or Profile Not Found</h1>
          <Link to="/browse" className="text-blue-600 hover:underline">
            Browse other profiles
          </Link>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container-custom py-8">
        <div className="max-w-4xl mx-auto">
          <BookingHeader profile={profile} id={id!} />
          
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div 
              className="md:col-span-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <DateTimePicker
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                selectedTime={selectedTime}
                setSelectedTime={setSelectedTime}
                availableTimes={availableTimes}
                isDateDisabled={isDateDisabled}
                handleConfirmBooking={handleConfirmBooking}
                isProcessing={isProcessing}
              />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <BookingSummary
                selectedProduct={selectedProduct}
                selectedDate={selectedDate}
                selectedTime={selectedTime}
              />
            </motion.div>
          </div>
        </div>
      </main>
      
      {profile && (
        <BookingConfirmationDialog
          isOpen={isConfirmationOpen}
          setIsOpen={setIsConfirmationOpen}
          selectedDate={selectedDate}
          selectedTime={selectedTime}
          selectedProduct={selectedProduct}
          profile={profile}
        />
      )}
      
      <Footer />
    </div>
  );
};

export default BookingPage;
