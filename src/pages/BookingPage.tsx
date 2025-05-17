
import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { getProfileById } from "@/services/profiles";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { toast } from "@/components/ui/use-toast";
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
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
  
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
      toast({
        title: "Error",
        description: "Please select a date and time",
        variant: "destructive"
      });
      return;
    }
    
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to book a session",
        variant: "destructive"
      });
      return;
    }
    
    setIsProcessing(true);

    try {
      // Combine date and time for scheduled_at
      const timeMatch = selectedTime.match(/^(\d+):(\d+) (AM|PM)$/);
      if (!timeMatch) {
        throw new Error("Invalid time format");
      }
      
      const [_, hours, minutes, period] = timeMatch;
      const isPM = period === 'PM';
      const hoursInt = parseInt(hours);
      
      // Convert to 24 hour format
      const adjustedHours = isPM && hoursInt !== 12 
        ? hoursInt + 12 
        : (isPM && hoursInt === 12 ? 12 : hoursInt === 12 ? 0 : hoursInt);
      
      const scheduledDateTime = new Date(selectedDate);
      scheduledDateTime.setHours(adjustedHours);
      scheduledDateTime.setMinutes(parseInt(minutes));

      console.log('Creating booking with:');
      console.log('- User ID:', user.id);
      console.log('- Profile ID:', id);
      console.log('- Scheduled at:', scheduledDateTime.toISOString());
      console.log('- Product:', selectedProduct.id);
      
      // Create the booking in the database
      const { data: bookingData, error: bookingError } = await supabase
        .from('bookings')
        .insert({
          user_id: user.id,
          profile_id: id,
          scheduled_at: scheduledDateTime.toISOString(),
          status: 'pending',
          booking_option_id: selectedProduct.id === 'quick-chat' ? null : null // Replace with actual booking option ID if needed
        })
        .select()
        .single();
      
      if (bookingError) {
        console.error('Database error:', bookingError);
        throw new Error(bookingError.message);
      }
      
      console.log('Booking created successfully:', bookingData);

      // Process payment by calling our payment processing edge function
      try {
        const { data: paymentData, error: paymentError } = await supabase.functions.invoke('create-payment', {
          body: {
            amount: selectedProduct.price * 100, // Convert to cents for Stripe
            product_name: `${selectedProduct.title} with ${profile.name}`,
            booking_id: bookingData.id,
            success_redirect: window.location.origin + '/payment-success',
            cancel_redirect: window.location.origin + '/payment-canceled'
          }
        });

        if (paymentError) {
          throw paymentError;
        }

        console.log('Payment session created:', paymentData);
        
        if (paymentData && paymentData.url) {
          // Redirect to the payment URL
          window.location.href = paymentData.url;
        } else {
          throw new Error('No payment URL returned');
        }
      } catch (paymentError) {
        console.error('Payment error:', paymentError);
        // If payment creation fails, we should update the booking status or delete it
        await supabase.from('bookings').update({ status: 'cancelled' }).eq('id', bookingData.id);
        throw new Error('Failed to process payment. Please try again.');
      }
      
    } catch (error) {
      console.error('Error creating booking:', error);
      toast({
        title: "Booking Failed",
        description: "There was an issue creating your booking. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
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
      
      <BookingConfirmationDialog
        isOpen={isConfirmationOpen}
        setIsOpen={setIsConfirmationOpen}
        selectedDate={selectedDate}
        selectedTime={selectedTime}
        selectedProduct={selectedProduct}
        profile={profile}
      />
      
      <Footer />
    </div>
  );
};

export default BookingPage;
