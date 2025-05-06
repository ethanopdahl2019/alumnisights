
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useAuth } from "@/components/AuthProvider";
import { isMentor, isAdmin } from "@/services/auth";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { UserPlus, VideoIcon, Calendar, Clock } from "lucide-react";
import ReferAlumniDialog from "@/components/mentor/ReferAlumniDialog";
import MyReferrals from "@/components/mentor/MyReferrals";
import RegistrationPreview from "@/components/mentor/RegistrationPreview";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogTitle, DialogHeader, DialogFooter, DialogDescription } from "@/components/ui/dialog";

interface Booking {
  id: string;
  scheduled_at: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  zoom_link: string | null;
  student: {
    name: string;
    email?: string;
  };
  booking_option: {
    title: string;
    duration: string;
  };
}

const MentorDashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [referDialogOpen, setReferDialogOpen] = useState(false);
  const [refreshReferrals, setRefreshReferrals] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoadingBookings, setIsLoadingBookings] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [zoomLinkDialogOpen, setZoomLinkDialogOpen] = useState(false);
  const [zoomLink, setZoomLink] = useState("");
  const [isUpdatingZoomLink, setIsUpdatingZoomLink] = useState(false);

  useEffect(() => {
    // Redirect if user is not logged in or not a mentor/admin
    if (!loading && (!user || (!isMentor(user) && !isAdmin(user)))) {
      toast({
        variant: "destructive",
        title: "Access Denied",
        description: "You must be a mentor to access this dashboard",
      });
      navigate("/");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user) return;

      setIsLoadingBookings(true);
      try {
        // Get the mentor's profile ID
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('id')
          .eq('user_id', user.id)
          .single();

        if (profileError) {
          throw profileError;
        }

        // Fetch bookings with student profiles and booking options
        const { data, error } = await supabase
          .from('bookings')
          .select(`
            id, 
            scheduled_at, 
            status, 
            zoom_link, 
            booking_options(title, duration),
            user_id
          `)
          .eq('profile_id', profileData.id)
          .order('scheduled_at', { ascending: true });

        if (error) {
          throw error;
        }

        // Get student names separately (since we need to join with auth.users)
        const studentDetails = await Promise.all(
          data.map(async (booking) => {
            try {
              const { data: userData, error: userError } = await supabase
                .from('profiles')
                .select('name')
                .eq('user_id', booking.user_id)
                .single();

              if (userError) throw userError;

              return {
                id: booking.id,
                name: userData?.name || 'Anonymous Student'
              };
            } catch (e) {
              console.error('Error fetching student details:', e);
              return {
                id: booking.id,
                name: 'Anonymous Student'
              };
            }
          })
        );

        // Combine the data
        const formattedBookings = data.map(booking => {
          const student = studentDetails.find(s => s.id === booking.id);
          return {
            id: booking.id,
            scheduled_at: booking.scheduled_at,
            status: booking.status,
            zoom_link: booking.zoom_link,
            student: { name: student?.name || 'Anonymous Student' },
            booking_option: booking.booking_options || { title: 'Session', duration: '30 min' }
          };
        });

        setBookings(formattedBookings);
      } catch (error) {
        console.error('Error fetching bookings:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load bookings",
        });
      } finally {
        setIsLoadingBookings(false);
      }
    };

    if (user && !loading) {
      fetchBookings();
    }
  }, [user, loading]);

  const handleOpenZoomLinkDialog = (booking: Booking) => {
    setSelectedBooking(booking);
    setZoomLink(booking.zoom_link || '');
    setZoomLinkDialogOpen(true);
  };

  const handleUpdateZoomLink = async () => {
    if (!selectedBooking) return;
    
    setIsUpdatingZoomLink(true);
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ 
          zoom_link: zoomLink,
          status: 'confirmed' 
        })
        .eq('id', selectedBooking.id);
      
      if (error) throw error;
      
      toast({
        title: "Zoom link updated",
        description: "The meeting link has been successfully added",
      });
      
      // Update local state
      setBookings(bookings.map(booking => 
        booking.id === selectedBooking.id 
          ? { ...booking, zoom_link: zoomLink, status: 'confirmed' } 
          : booking
      ));
      
      setZoomLinkDialogOpen(false);
    } catch (error) {
      console.error('Error updating zoom link:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update the Zoom link",
      });
    } finally {
      setIsUpdatingZoomLink(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!user || (!isMentor(user) && !isAdmin(user))) {
    return null; // Will redirect via useEffect
  }

  const handleReferralComplete = () => {
    setRefreshReferrals(prev => !prev);
  };

  const isUserAdmin = isAdmin(user);
  
  const upcomingBookings = bookings.filter(booking => 
    new Date(booking.scheduled_at) > new Date() && 
    (booking.status === 'pending' || booking.status === 'confirmed')
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Mentor Dashboard | AlumniSights</title>
      </Helmet>
      <Navbar />
      
      <main className="flex-grow container-custom py-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h1 className="text-3xl font-bold text-navy">Mentor Dashboard</h1>
          <Button 
            className="mt-4 md:mt-0 flex items-center gap-2" 
            onClick={() => setReferDialogOpen(true)}
          >
            <UserPlus className="h-4 w-4" />
            Refer an Alumni
          </Button>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="sessions">Sessions</TabsTrigger>
            {isUserAdmin && <TabsTrigger value="registration-preview">Registration Preview</TabsTrigger>}
          </TabsList>
          
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              <Card>
                <CardHeader>
                  <CardTitle>Your Profile</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    Update your mentor profile and expertise areas
                  </p>
                  <div className="mt-4">
                    <Button 
                      variant="outline"
                      className="text-blue-600 text-sm font-medium"
                      onClick={() => navigate('/account')}
                    >
                      Edit Profile
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <MyReferrals key={refreshReferrals ? 'refresh' : 'initial'} />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Student Requests</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    View and manage student mentoring requests
                  </p>
                  <div className="mt-4">
                    <span className="text-2xl font-bold">
                      {bookings.filter(b => b.status === 'pending').length}
                    </span>
                    <span className="text-sm text-gray-500 ml-2">pending requests</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Your Schedule</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    Manage your availability and upcoming sessions
                  </p>
                  <div className="mt-4">
                    <span className="text-2xl font-bold">
                      {upcomingBookings.length}
                    </span>
                    <span className="text-sm text-gray-500 ml-2">upcoming sessions</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Actions Needed</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    Sessions that require your attention
                  </p>
                  <div className="mt-4">
                    <span className="text-2xl font-bold">
                      {bookings.filter(b => !b.zoom_link && b.status === 'pending').length}
                    </span>
                    <span className="text-sm text-gray-500 ml-2">need Zoom links</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="sessions">
            <Card>
              <CardHeader>
                <CardTitle>Your Sessions</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoadingBookings ? (
                  <div className="py-8 flex justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
                  </div>
                ) : bookings.length > 0 ? (
                  <div className="space-y-4">
                    {bookings.map((booking) => (
                      <div 
                        key={booking.id} 
                        className="border rounded-lg p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                      >
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-medium">{booking.booking_option.title}</span>
                            <Badge variant={booking.status === 'confirmed' ? 'default' : booking.status === 'pending' ? 'secondary' : 'outline'}>
                              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                            </Badge>
                          </div>
                          <p className="text-sm">With {booking.student.name}</p>
                          <div className="flex items-center gap-4 mt-2">
                            <div className="flex items-center text-sm text-gray-500">
                              <Calendar className="h-4 w-4 mr-1" />
                              {format(new Date(booking.scheduled_at), 'MMMM d, yyyy')}
                            </div>
                            <div className="flex items-center text-sm text-gray-500">
                              <Clock className="h-4 w-4 mr-1" />
                              {format(new Date(booking.scheduled_at), 'h:mm a')}
                            </div>
                          </div>
                        </div>
                        
                        <div className="ml-auto">
                          {booking.zoom_link ? (
                            <div className="space-y-2">
                              <a
                                href={booking.zoom_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition flex items-center gap-1 text-sm"
                              >
                                <VideoIcon className="h-3.5 w-3.5" />
                                Join Meeting
                              </a>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="w-full text-sm"
                                onClick={() => handleOpenZoomLinkDialog(booking)}
                              >
                                Edit Link
                              </Button>
                            </div>
                          ) : (
                            <Button 
                              className="flex items-center gap-1" 
                              size="sm" 
                              onClick={() => handleOpenZoomLinkDialog(booking)}
                            >
                              <VideoIcon className="h-3.5 w-3.5" />
                              Add Zoom Link
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center">
                    <p className="text-gray-500">You don't have any sessions yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {isUserAdmin && (
            <TabsContent value="registration-preview">
              <RegistrationPreview />
            </TabsContent>
          )}
        </Tabs>
      </main>
      
      <Dialog open={zoomLinkDialogOpen} onOpenChange={setZoomLinkDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Zoom Meeting Link</DialogTitle>
            <DialogDescription>
              Enter the Zoom meeting link for the session with {selectedBooking?.student.name}
              on {selectedBooking && format(new Date(selectedBooking.scheduled_at), 'MMMM d, yyyy')} at 
              {selectedBooking && format(new Date(selectedBooking.scheduled_at), ' h:mm a')}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="zoom-link" className="text-sm font-medium">Zoom Meeting URL</label>
              <Input
                id="zoom-link"
                placeholder="https://zoom.us/j/123456789"
                value={zoomLink}
                onChange={(e) => setZoomLink(e.target.value)}
              />
            </div>
            <p className="text-xs text-gray-500">
              This link will be shared with the student and they'll use it to join the meeting at the scheduled time.
            </p>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setZoomLinkDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleUpdateZoomLink}
              disabled={isUpdatingZoomLink || !zoomLink}
            >
              {isUpdatingZoomLink ? (
                <>
                  <div className="animate-spin mr-2 h-4 w-4 border-2 border-b-transparent rounded-full"></div>
                  Saving...
                </>
              ) : (
                "Save Link"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <ReferAlumniDialog 
        open={referDialogOpen}
        onOpenChange={setReferDialogOpen}
        onReferralComplete={handleReferralComplete}
      />
      
      <Footer />
    </div>
  );
};

export default MentorDashboard;
