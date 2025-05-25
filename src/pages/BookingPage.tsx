
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { getProfileById } from '@/services/profiles';
import { ProfileWithDetails } from '@/types/database';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/components/AuthProvider';
import BookingHeader from '@/components/booking/BookingHeader';
import DateTimePicker from '@/components/booking/DateTimePicker';
import BookingSummary from '@/components/booking/BookingSummary';
import PaymentMethodSelection from '@/components/booking/PaymentMethodSelection';
import BookingConfirmationDialog from '@/components/booking/BookingConfirmationDialog';

const BookingPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [profile, setProfile] = useState<ProfileWithDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDateTime, setSelectedDateTime] = useState<Date | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<15 | 30 | 60>(30);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal'>('card');
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    // Check if user is authenticated
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to book a session",
        variant: "destructive"
      });
      navigate('/auth');
      return;
    }

    const fetchProfile = async () => {
      if (!id) {
        toast({
          title: "Error",
          description: "Profile ID is missing",
          variant: "destructive"
        });
        navigate('/browse');
        return;
      }

      try {
        const profileData = await getProfileById(id);
        if (!profileData) {
          toast({
            title: "Profile not found",
            description: "The requested profile could not be found",
            variant: "destructive"
          });
          navigate('/browse');
          return;
        }
        
        // Check if this profile offers booking services
        const hasBookingOptions = profileData.price_15_min || profileData.price_30_min || profileData.price_60_min;
        if (!hasBookingOptions) {
          toast({
            title: "Booking not available",
            description: "This mentor doesn't offer booking services",
            variant: "destructive"
          });
          navigate(`/alumni/${id}`);
          return;
        }
        
        setProfile(profileData);
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast({
          title: "Error loading profile",
          description: "Could not load the profile. Please try again.",
          variant: "destructive"
        });
        navigate('/browse');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id, navigate, user]);

  const getPrice = (duration: 15 | 30 | 60) => {
    if (!profile) return 0;
    switch (duration) {
      case 15:
        return profile.price_15_min || 0;
      case 30:
        return profile.price_30_min || 0;
      case 60:
        return profile.price_60_min || 0;
      default:
        return 0;
    }
  };

  const handleBooking = () => {
    if (!selectedDateTime) {
      toast({
        title: "Date and time required",
        description: "Please select a date and time for your session",
        variant: "destructive"
      });
      return;
    }

    setShowConfirmation(true);
  };

  const handleBack = () => {
    navigate(`/alumni/${id}`);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">Profile Not Found</h1>
          <p className="text-gray-600 mb-6">The profile you're trying to book with doesn't exist.</p>
          <Button onClick={() => navigate('/browse')}>
            Back to Browse
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <Button 
          variant="ghost" 
          onClick={handleBack} 
          className="mb-6 flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Profile
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <BookingHeader profile={profile} />
            
            <Card>
              <CardHeader>
                <CardTitle>Select Date & Time</CardTitle>
              </CardHeader>
              <CardContent>
                <DateTimePicker
                  selectedDateTime={selectedDateTime}
                  onDateTimeChange={setSelectedDateTime}
                  selectedDuration={selectedDuration}
                  onDurationChange={setSelectedDuration}
                  availableDurations={[
                    ...(profile.price_15_min ? [15 as const] : []),
                    ...(profile.price_30_min ? [30 as const] : []),
                    ...(profile.price_60_min ? [60 as const] : [])
                  ]}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
              </CardHeader>
              <CardContent>
                <PaymentMethodSelection
                  paymentMethod={paymentMethod}
                  onPaymentMethodChange={setPaymentMethod}
                />
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <BookingSummary
              profile={profile}
              selectedDateTime={selectedDateTime}
              selectedDuration={selectedDuration}
              price={getPrice(selectedDuration)}
              onBooking={handleBooking}
            />
          </div>
        </div>

        <BookingConfirmationDialog
          open={showConfirmation}
          onOpenChange={setShowConfirmation}
          profile={profile}
          selectedDateTime={selectedDateTime}
          selectedDuration={selectedDuration}
          price={getPrice(selectedDuration)}
          paymentMethod={paymentMethod}
        />
      </div>
    </div>
  );
};

export default BookingPage;
