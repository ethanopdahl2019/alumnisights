
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/components/AuthProvider";
import { isStudent, isAdmin } from "@/services/auth";
import { toast } from "@/hooks/use-toast";
import { VideoIcon, CalendarIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MyReviews from "@/components/MyReviews";
import ReviewForm from "@/components/ReviewForm";
import { Button } from "@/components/ui/button";

// Define interface for column check response
interface ColumnCheckResponse {
  exists: boolean;
  data: { column_name: string }[];
}

interface Booking {
  id: string;
  scheduled_at: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  zoom_link: string | null;
  mentor: {
    id: string; // Add id property to mentor
    name: string;
    image: string | null;
  };
  booking_option: {
    title: string;
    duration: string;
  };
}

const StudentDashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [completedSessions, setCompletedSessions] = useState<Booking[]>([]);
  const [isLoadingBookings, setIsLoadingBookings] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    // Redirect if user is not logged in or not a student/admin
    if (!loading) {
      console.log('StudentDashboard - user:', user?.email, 'isStudent:', user ? isStudent(user) : false, 'isAdmin:', user ? isAdmin(user) : false);
      
      if (!user || (!isStudent(user) && !isAdmin(user))) {
        toast({
          variant: "destructive",
          title: "Access Denied",
          description: "You must be a student to access this dashboard",
        });
        navigate("/");
        return;
      }
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user) return;
      
      setIsLoadingBookings(true);
      try {
        // Fetch bookings with zoom links directly - simpler approach
        const { data, error } = await supabase
          .from('bookings')
          .select(`
            id, 
            scheduled_at, 
            status, 
            zoom_link, 
            profiles!bookings_profile_id_fkey(id, name, image), 
            booking_options(title, duration)
          `)
          .eq('user_id', user.id)
          .order('scheduled_at', { ascending: true });

        if (error) {
          throw error;
        }

        // Transform data to match our expected format
        const formattedBookings = data.map(booking => {
          return {
            id: booking.id,
            scheduled_at: booking.scheduled_at,
            status: booking.status,
            zoom_link: booking.zoom_link,
            mentor: {
              id: booking.profiles.id, // Include mentor id
              name: booking.profiles.name || 'Unknown',
              image: booking.profiles.image
            },
            booking_option: booking.booking_options || { title: 'Session', duration: '30 min' }
          };
        });

        // Split into upcoming and completed sessions
        const completed = formattedBookings.filter(b => b.status === 'completed');
        const upcoming = formattedBookings.filter(b => b.status !== 'completed');
        
        setBookings(upcoming);
        setCompletedSessions(completed);
      } catch (error) {
        console.error('Error fetching bookings:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load your bookings",
        });
      } finally {
        setIsLoadingBookings(false);
      }
    };

    if (user && !loading) {
      fetchBookings();
    }
  }, [user, loading]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!user || (!isStudent(user) && !isAdmin(user))) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Student Dashboard | AlumniSights</title>
      </Helmet>
      <Navbar />
      
      <main className="flex-grow container-custom py-10">
        <h1 className="text-3xl font-bold text-navy mb-6">Student Dashboard</h1>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="sessions">Sessions</TabsTrigger>
            <TabsTrigger value="reviews">My Reviews</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Find Mentors</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    Browse alumni mentors by school, major or expertise
                  </p>
                  <div className="mt-4">
                    <button 
                      onClick={() => navigate('/browse')}
                      className="text-blue-600 text-sm font-medium"
                    >
                      Explore Mentors
                    </button>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Your Sessions</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    View your upcoming and past mentoring sessions
                  </p>
                  <div className="mt-4">
                    <span className="text-2xl font-bold">{bookings.filter(b => b.status === 'confirmed').length}</span>
                    <span className="text-sm text-gray-500 ml-2">upcoming sessions</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Application Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    Track your college application status
                  </p>
                  <div className="mt-4">
                    <button className="text-blue-600 text-sm font-medium">
                      Update Status
                    </button>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="mt-10">
              <h2 className="text-xl font-bold text-navy mb-4">Your Booked Sessions</h2>
              
              {isLoadingBookings ? (
                <div className="bg-gray-50 p-6 rounded-lg flex justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
                </div>
              ) : bookings.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                  {bookings.map((booking) => (
                    <Card key={booking.id} className="overflow-hidden">
                      <div className="p-6 flex flex-col md:flex-row gap-4 items-center">
                        <div className="md:w-16 md:h-16 w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                          {booking.mentor.image ? (
                            <img
                              src={booking.mentor.image}
                              alt={booking.mentor.name}
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
                          <p className="text-sm">Session with {booking.mentor.name}</p>
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
                  <p className="text-gray-500 italic text-center">You don't have any booked sessions yet</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="sessions">
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-navy mb-4">Upcoming Sessions</h2>
                {isLoadingBookings ? (
                  <div className="bg-gray-50 p-6 rounded-lg flex justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
                  </div>
                ) : bookings.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4">
                    {bookings.map((booking) => (
                      <Card key={booking.id} className="overflow-hidden">
                        <div className="p-6 flex flex-col md:flex-row gap-4 items-center">
                          <div className="md:w-16 md:h-16 w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                            {booking.mentor.image ? (
                              <img
                                src={booking.mentor.image}
                                alt={booking.mentor.name}
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
                            <p className="text-sm">Session with {booking.mentor.name}</p>
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
                    <p className="text-gray-500 italic text-center">You don't have any upcoming sessions</p>
                  </div>
                )}
              </div>
              
              <div>
                <h2 className="text-xl font-bold text-navy mb-4">Completed Sessions</h2>
                {isLoadingBookings ? (
                  <div className="bg-gray-50 p-6 rounded-lg flex justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
                  </div>
                ) : completedSessions.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4">
                    {completedSessions.map((session) => (
                      <Card key={session.id} className="overflow-hidden">
                        <div className="p-6 flex flex-col md:flex-row gap-4 items-center">
                          <div className="md:w-16 md:h-16 w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                            {session.mentor.image ? (
                              <img
                                src={session.mentor.image}
                                alt={session.mentor.name}
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
                              <h3 className="font-medium text-lg">{session.booking_option.title}</h3>
                              <Badge variant="outline">Completed</Badge>
                            </div>
                            <p className="text-sm">Session with {session.mentor.name}</p>
                            <p className="text-sm text-gray-500 flex items-center justify-center md:justify-start gap-1 mt-1">
                              <CalendarIcon size={14} />
                              {format(new Date(session.scheduled_at), 'MMMM d, yyyy - h:mm a')}
                            </p>
                          </div>
                          
                          <Button 
                            onClick={() => {
                              setActiveTab("reviews");
                              // Optionally scroll to review form
                              setTimeout(() => {
                                const reviewFormElement = document.getElementById(`review-form-${session.mentor.id}`);
                                if (reviewFormElement) {
                                  reviewFormElement.scrollIntoView({ behavior: 'smooth' });
                                }
                              }, 100);
                            }}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            Leave Review
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <p className="text-gray-500 italic text-center">You don't have any completed sessions yet</p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="reviews">
            <div className="space-y-8">
              <div>
                <h2 className="text-xl font-bold text-navy mb-4">Reviews You've Written</h2>
                <MyReviews />
              </div>
              
              {completedSessions.length > 0 && (
                <div>
                  <h2 className="text-xl font-bold text-navy mb-4">Leave a Review</h2>
                  <div className="space-y-8">
                    {completedSessions.map((session) => (
                      <Card key={`review-form-${session.mentor.id}`} id={`review-form-${session.mentor.id}`} className="p-6">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
                            {session.mentor.image ? (
                              <img
                                src={session.mentor.image}
                                alt={session.mentor.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500">
                                <VideoIcon size={20} />
                              </div>
                            )}
                          </div>
                          <div>
                            <h3 className="text-lg font-medium">{session.mentor.name}</h3>
                            <p className="text-sm text-gray-600">
                              {session.booking_option.title} on {format(new Date(session.scheduled_at), 'MMMM d, yyyy')}
                            </p>
                          </div>
                        </div>
                        <ReviewForm 
                          profileId={session.mentor.id} 
                          mentorName={session.mentor.name} 
                          onSuccess={() => {
                            // Refresh the reviews list
                            const reviewsList = document.querySelector('button[value="reviews"]');
                            if (reviewsList) {
                              (reviewsList as HTMLElement).click();
                            }
                          }}
                        />
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>
      
      <Footer />
    </div>
  );
};

export default StudentDashboard;
