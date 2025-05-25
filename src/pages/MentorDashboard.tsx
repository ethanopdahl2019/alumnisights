
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/components/AuthProvider";
import { isMentor, isAdmin } from "@/services/auth";
import { toast } from "@/hooks/use-toast";
import { VideoIcon, CalendarIcon, DollarSign, Users, MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MyReferrals from "@/components/mentor/MyReferrals";

interface Booking {
  id: string;
  scheduled_at: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  zoom_link: string | null;
  student: {
    id: string;
    name: string;
    image: string | null;
  };
  booking_option: {
    title: string;
    duration: string;
  };
}

const MentorDashboard = () => {
  const { user, loading, isAdmin: userIsAdmin } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [earnings, setEarnings] = useState({ total: 0, thisMonth: 0 });
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    // Allow access for mentors OR admins
    if (!loading) {
      console.log('MentorDashboard - user:', user?.email, 'isMentor:', user ? isMentor(user) : false, 'isAdmin:', userIsAdmin);
      
      if (!user) {
        toast({
          variant: "destructive",
          title: "Access Denied",
          description: "You must be logged in to access this dashboard",
        });
        navigate("/auth");
        return;
      }
      
      // Allow access if user is mentor OR admin
      if (!isMentor(user) && !userIsAdmin) {
        toast({
          variant: "destructive",
          title: "Access Denied",
          description: "You must be a mentor to access this dashboard",
        });
        navigate("/");
        return;
      }
    }
  }, [user, loading, userIsAdmin, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      
      setIsLoadingData(true);
      try {
        // First, get the current user's profile to find their profile_id
        const { data: userProfile, error: profileError } = await supabase
          .from('profiles')
          .select('id')
          .eq('user_id', user.id)
          .single();

        if (profileError) {
          console.error('Error fetching user profile:', profileError);
          throw profileError;
        }

        if (!userProfile) {
          console.log('No profile found for user');
          setBookings([]);
          setEarnings({ total: 500, thisMonth: 150 });
          return;
        }

        // Fetch bookings for the mentor using the profile_id
        const { data: bookingsData, error: bookingsError } = await supabase
          .from('bookings')
          .select(`
            id, 
            scheduled_at, 
            status, 
            zoom_link,
            user_id,
            booking_option_id
          `)
          .eq('profile_id', userProfile.id)
          .order('scheduled_at', { ascending: true });

        if (bookingsError) {
          console.error('Error fetching bookings:', bookingsError);
          throw bookingsError;
        }

        // Now fetch the related data for each booking
        const formattedBookings: Booking[] = [];
        
        if (bookingsData && bookingsData.length > 0) {
          for (const booking of bookingsData) {
            // Get student profile
            const { data: studentProfile } = await supabase
              .from('profiles')
              .select('id, name, image')
              .eq('user_id', booking.user_id)
              .single();

            // Get booking option
            const { data: bookingOption } = await supabase
              .from('booking_options')
              .select('title, duration')
              .eq('id', booking.booking_option_id)
              .single();

            formattedBookings.push({
              id: booking.id,
              scheduled_at: booking.scheduled_at,
              status: booking.status,
              zoom_link: booking.zoom_link,
              student: {
                id: studentProfile?.id || '',
                name: studentProfile?.name || 'Unknown Student',
                image: studentProfile?.image || null
              },
              booking_option: {
                title: bookingOption?.title || 'Session',
                duration: bookingOption?.duration || '30 min'
              }
            });
          }
        }

        setBookings(formattedBookings);

        // Fetch earnings (example - replace with actual logic)
        setEarnings({ total: 500, thisMonth: 150 });
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load dashboard data",
        });
      } finally {
        setIsLoadingData(false);
      }
    };

    if (user && !loading) {
      fetchData();
    }
  }, [user, loading]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // Allow access if user is mentor OR admin
  if (!user || (!isMentor(user) && !userIsAdmin)) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Mentor Dashboard | AlumniSights</title>
      </Helmet>
      <Navbar />
      
      <main className="flex-grow container-custom py-10">
        {userIsAdmin && (
          <div className="mb-4 p-4 bg-blue-50 rounded-lg">
            <p className="text-blue-800 font-medium">
              👑 Admin View: You're viewing the Mentor Dashboard as an administrator
            </p>
          </div>
        )}
        
        <h1 className="text-3xl font-bold text-navy mb-6">Mentor Dashboard</h1>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="sessions">Sessions</TabsTrigger>
            <TabsTrigger value="referrals">Referrals</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Earnings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-green-500" />
                      <span className="text-2xl font-bold">${earnings.total}</span>
                    </div>
                    <p className="text-sm text-gray-500">Total Earnings</p>
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-green-500" />
                      <span className="text-xl font-bold">${earnings.thisMonth}</span>
                    </div>
                    <p className="text-sm text-gray-500">Earnings This Month</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Sessions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4 text-blue-500" />
                      <span className="text-2xl font-bold">{bookings.filter(b => b.status === 'confirmed').length}</span>
                    </div>
                    <p className="text-sm text-gray-500">Confirmed Sessions</p>
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-blue-500" />
                      <span className="text-xl font-bold">{bookings.filter(b => b.status === 'pending').length}</span>
                    </div>
                    <p className="text-sm text-gray-500">Pending Requests</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Referrals</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-purple-500" />
                      <span className="text-2xl font-bold">5</span>
                    </div>
                    <p className="text-sm text-gray-500">New Referrals</p>
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-purple-500" />
                      <span className="text-xl font-bold">12</span>
                    </div>
                    <p className="text-sm text-gray-500">Total Referrals</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="sessions">
            {isLoadingData ? (
              <div className="flex items-center justify-center min-h-[200px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
              </div>
            ) : bookings.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {bookings.map((booking) => (
                  <Card key={booking.id} className="overflow-hidden">
                    <div className="p-6 flex flex-col md:flex-row gap-4 items-center">
                      <div className="md:w-16 md:h-16 w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                        {booking.student.image ? (
                          <img
                            src={booking.student.image}
                            alt={booking.student.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500">
                            <VideoIcon size={20} />
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-grow text-center md:text-left">
                        <div className="flex flex-col md:flex-row md:items-center gap-2 mb-1">
                          <h3 className="font-medium text-lg">{booking.booking_option.title}</h3>
                          <Badge variant={booking.status === 'confirmed' ? 'default' : booking.status === 'pending' ? 'secondary' : 'outline'}>
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </Badge>
                        </div>
                        <p className="text-sm">Session with {booking.student.name}</p>
                        <p className="text-sm text-gray-500 flex items-center justify-center md:justify-start gap-1 mt-1">
                          <CalendarIcon size={14} />
                          {format(new Date(booking.scheduled_at), 'MMMM d, yyyy - h:mm a')}
                          <span className="mx-1">•</span>
                          {booking.booking_option.duration}
                        </p>
                      </div>
                      
                      {booking.zoom_link ? (
                        <a
                          href={booking.zoom_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition flex items-center gap-2"
                        >
                          <VideoIcon size={16} />
                          Join Meeting
                        </a>
                      ) : (
                        <button
                          disabled
                          className="bg-gray-300 text-gray-600 px-4 py-2 rounded-lg flex items-center gap-2 cursor-not-allowed"
                        >
                          <VideoIcon size={16} />
                          Awaiting Link
                        </button>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 p-6 rounded-lg">
                <p className="text-gray-500 italic text-center">No sessions found.</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="referrals">
            <MyReferrals />
          </TabsContent>
        </Tabs>
      </main>
      
      <Footer />
    </div>
  );
};

export default MentorDashboard;
