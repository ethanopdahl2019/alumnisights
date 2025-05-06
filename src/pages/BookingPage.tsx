
import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { getProfileById } from "@/services/profiles";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Calendar as CalendarIcon, Clock, ArrowLeft, Check } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { toast } from "@/components/ui/use-toast";

const BookingPage = () => {
  const { id, productId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
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
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to book a session",
        variant: "destructive"
      });
      navigate("/auth");
      return;
    }

    if (!selectedDate || !selectedTime) {
      toast({
        title: "Error",
        description: "Please select a date and time",
        variant: "destructive"
      });
      return;
    }
    
    setIsProcessing(true);

    try {
      // Combine date and time
      const [hours, minutes] = selectedTime.split(':');
      const isPM = selectedTime.includes('PM');
      const hoursInt = parseInt(hours);
      
      // Convert to 24 hour format for storage
      const adjustedHours = isPM && hoursInt !== 12 ? hoursInt + 12 : hoursInt;
      
      const scheduledDateTime = new Date(selectedDate);
      scheduledDateTime.setHours(adjustedHours);
      scheduledDateTime.setMinutes(parseInt(minutes));
      
      // Find or create booking option
      const { data: existingOptions, error: optionsError } = await supabase
        .from('booking_options')
        .select('id')
        .eq('profile_id', id)
        .eq('title', selectedProduct.title)
        .eq('duration', selectedProduct.duration)
        .eq('price', selectedProduct.price)
        .maybeSingle();
        
      if (optionsError) throw optionsError;
      
      let bookingOptionId: string;
      
      if (existingOptions) {
        bookingOptionId = existingOptions.id;
      } else {
        // Create booking option if it doesn't exist
        const { data: newOption, error: createOptionError } = await supabase
          .from('booking_options')
          .insert({
            profile_id: id,
            title: selectedProduct.title,
            duration: selectedProduct.duration,
            price: selectedProduct.price,
            description: `Session with ${profile.name}`
          })
          .select('id')
          .single();
          
        if (createOptionError) throw createOptionError;
        bookingOptionId = newOption.id;
      }
      
      // Create booking record
      const { error: bookingError } = await supabase
        .from('bookings')
        .insert({
          user_id: user.id,
          profile_id: id,
          booking_option_id: bookingOptionId,
          scheduled_at: scheduledDateTime.toISOString(),
          status: 'pending'
        });
        
      if (bookingError) throw bookingError;
      
      setIsConfirmationOpen(true);
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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <Button
              variant="ghost"
              onClick={() => navigate(`/alumni/${id}`)}
              className="flex items-center text-gray-600"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Profile
            </Button>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden">
                    <img 
                      src={profile.image || "/placeholder.svg"}
                      alt={profile.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h1 className="text-xl">Book a Session with {profile.name}</h1>
                    <p className="text-sm text-gray-500 font-normal">
                      {profile.school?.name} • {profile.major?.name}
                    </p>
                  </div>
                </CardTitle>
              </CardHeader>
            </Card>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div 
              className="md:col-span-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Select a Date & Time</CardTitle>
                  <CardDescription>
                    Choose from available slots in the mentor's calendar
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium mb-2 flex items-center">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      Date
                    </h3>
                    <div className="border rounded-lg overflow-hidden">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        disabled={isDateDisabled}
                        className="rounded-md border"
                      />
                    </div>
                  </div>
                  
                  {selectedDate && (
                    <div>
                      <h3 className="text-sm font-medium mb-2 flex items-center">
                        <Clock className="mr-2 h-4 w-4" />
                        Available Times for {format(selectedDate, "MMMM d, yyyy")}
                      </h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {availableTimes.map((time) => (
                          <Button
                            key={time}
                            variant={selectedTime === time ? "default" : "outline"}
                            className={cn(
                              "justify-center",
                              selectedTime === time ? "bg-primary text-primary-foreground" : ""
                            )}
                            onClick={() => setSelectedTime(time)}
                          >
                            {time}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full" 
                    disabled={!selectedDate || !selectedTime || isProcessing}
                    onClick={handleConfirmBooking}
                  >
                    {isProcessing ? (
                      <>
                        <div className="animate-spin mr-2 h-4 w-4 border-2 border-b-transparent rounded-full"></div>
                        Processing...
                      </>
                    ) : (
                      "Confirm Booking"
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Booking Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-medium">{selectedProduct.title}</h3>
                    <p className="text-sm text-gray-500">{selectedProduct.duration}</p>
                  </div>
                  
                  {selectedDate && selectedTime && (
                    <div className="pt-2 border-t">
                      <h3 className="font-medium mb-1">Selected Time</h3>
                      <p className="text-sm flex items-center gap-2">
                        <CalendarIcon className="h-4 w-4 text-gray-500" />
                        {format(selectedDate, "MMMM d, yyyy")}
                      </p>
                      <p className="text-sm flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-500" />
                        {selectedTime}
                      </p>
                    </div>
                  )}
                  
                  <div className="pt-2 border-t">
                    <div className="flex justify-between font-medium">
                      <span>Total</span>
                      <span>${selectedProduct.price}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </main>
      
      <Dialog open={isConfirmationOpen} onOpenChange={setIsConfirmationOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="bg-green-100 p-1 rounded-full">
                <Check className="h-5 w-5 text-green-600" />
              </div>
              Booking Confirmed!
            </DialogTitle>
            <DialogDescription>
              Your session has been booked successfully and is awaiting confirmation.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Session:</span>
              <span className="font-medium">{selectedProduct.title} ({selectedProduct.duration})</span>
            </div>
            {selectedDate && selectedTime && (
              <>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Date:</span>
                  <span className="font-medium">{format(selectedDate, "MMMM d, yyyy")}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Time:</span>
                  <span className="font-medium">{selectedTime}</span>
                </div>
              </>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">With:</span>
              <span className="font-medium">{profile.name}</span>
            </div>
            <div className="bg-blue-50 p-3 rounded-md mt-4">
              <p className="text-sm text-blue-800">
                An administrator will review your booking and add a Zoom link. You'll be able to see the link in your student dashboard once it's added.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => navigate(`/student-dashboard`)}>
              Go to Dashboard
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Footer />
    </div>
  );
};

export default BookingPage;
