
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VideoIcon, CalendarIcon, Clock, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";

interface Booking {
  id: string;
  scheduled_at: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  zoom_link: string | null;
  student: {
    name: string;
    id: string;
  };
  mentor: {
    name: string;
    id: string;
  };
  booking_option: {
    title: string;
    duration: string;
  };
}

const BookingManagement = () => {
  const { user, loading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [zoomLinkDialogOpen, setZoomLinkDialogOpen] = useState(false);
  const [zoomLink, setZoomLink] = useState("");
  const [isUpdatingLink, setIsUpdatingLink] = useState(false);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) return;
      
      try {
        const { data } = await supabase
          .from('profiles')
          .select('role')
          .eq('user_id', user.id)
          .single();
        
        if (data && data.role === 'admin') {
          setIsAdmin(true);
        } else {
          toast.error("You don't have permission to access this page");
          navigate('/');
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
        navigate('/');
      }
    };
    
    if (!loading) {
      if (!user) {
        toast.error("Please sign in to access this page");
        navigate('/auth');
      } else {
        checkAdminStatus();
      }
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    const fetchBookings = async () => {
      if (!isAdmin) return;
      
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('bookings')
          .select(`
            id,
            scheduled_at,
            status,
            zoom_link,
            user_id,
            profile_id,
            booking_options (
              title,
              duration
            )
          `)
          .order('scheduled_at', { ascending: false });
        
        if (error) throw error;
        
        if (!data) {
          setBookings([]);
          setIsLoading(false);
          return;
        }

        // Get user profiles for both students and mentors
        const enrichedBookings = await Promise.all(
          data.map(async (booking) => {
            try {
              // Get student profile
              const { data: studentData } = await supabase
                .from('profiles')
                .select('name, id')
                .eq('user_id', booking.user_id)
                .single();
              
              // Get mentor profile
              const { data: mentorData } = await supabase
                .from('profiles')
                .select('name, id')
                .eq('id', booking.profile_id)
                .single();
              
              return {
                id: booking.id,
                scheduled_at: booking.scheduled_at,
                status: booking.status,
                zoom_link: booking.zoom_link,
                student: studentData || { name: 'Unknown Student', id: '' },
                mentor: mentorData || { name: 'Unknown Mentor', id: '' },
                booking_option: booking.booking_options || { title: 'Unknown', duration: '30 min' }
              };
            } catch (error) {
              console.error('Error fetching profiles:', error);
              return {
                id: booking.id,
                scheduled_at: booking.scheduled_at,
                status: booking.status,
                zoom_link: booking.zoom_link,
                student: { name: 'Unknown Student', id: '' },
                mentor: { name: 'Unknown Mentor', id: '' },
                booking_option: booking.booking_options || { title: 'Unknown', duration: '30 min' }
              };
            }
          })
        );
        
        setBookings(enrichedBookings as Booking[]);
      } catch (error) {
        console.error('Error fetching bookings:', error);
        toast.error('Failed to load bookings');
      } finally {
        setIsLoading(false);
      }
    };
    
    if (isAdmin) {
      fetchBookings();
    }
  }, [isAdmin]);

  const handleOpenZoomLinkDialog = (booking: Booking) => {
    setSelectedBooking(booking);
    setZoomLink(booking.zoom_link || '');
    setZoomLinkDialogOpen(true);
  };

  const handleUpdateZoomLink = async () => {
    if (!selectedBooking) return;
    
    setIsUpdatingLink(true);
    try {
      const { error } = await supabase
        .from('bookings')
        .update({
          zoom_link: zoomLink,
          status: 'confirmed'
        })
        .eq('id', selectedBooking.id);
      
      if (error) throw error;
      
      toast.success('Zoom link successfully updated');
      
      // Update local state
      setBookings(bookings.map(booking => 
        booking.id === selectedBooking.id
          ? { ...booking, zoom_link: zoomLink, status: 'confirmed' }
          : booking
      ));
      
      setZoomLinkDialogOpen(false);
    } catch (error) {
      console.error('Error updating zoom link:', error);
      toast.error('Failed to update Zoom link');
    } finally {
      setIsUpdatingLink(false);
    }
  };

  if (loading || (isAdmin && isLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return null; // Will redirect via useEffect
  }

  const pendingBookings = bookings.filter(b => b.status === 'pending');
  const confirmedBookings = bookings.filter(b => b.status === 'confirmed');
  const otherBookings = bookings.filter(b => !['pending', 'confirmed'].includes(b.status));

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Booking Management | Admin</title>
      </Helmet>
      <Navbar />
      
      <main className="flex-grow container-custom py-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h1 className="text-3xl font-bold text-navy">Booking Management</h1>
          <Button
            variant="outline"
            onClick={() => navigate('/admin/dashboard')}
          >
            Back to Dashboard
          </Button>
        </div>
        
        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="pending">
              Pending ({pendingBookings.length})
            </TabsTrigger>
            <TabsTrigger value="confirmed">
              Confirmed ({confirmedBookings.length})
            </TabsTrigger>
            <TabsTrigger value="other">
              Others ({otherBookings.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="pending">
            <Card>
              <CardHeader>
                <CardTitle>Pending Bookings</CardTitle>
              </CardHeader>
              <CardContent>
                {pendingBookings.length > 0 ? (
                  <div className="space-y-4">
                    {pendingBookings.map((booking) => (
                      <BookingItem 
                        key={booking.id} 
                        booking={booking} 
                        onAddZoomLink={() => handleOpenZoomLinkDialog(booking)} 
                      />
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center">
                    <p className="text-gray-500">No pending bookings</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="confirmed">
            <Card>
              <CardHeader>
                <CardTitle>Confirmed Bookings</CardTitle>
              </CardHeader>
              <CardContent>
                {confirmedBookings.length > 0 ? (
                  <div className="space-y-4">
                    {confirmedBookings.map((booking) => (
                      <BookingItem 
                        key={booking.id} 
                        booking={booking} 
                        onAddZoomLink={() => handleOpenZoomLinkDialog(booking)} 
                      />
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center">
                    <p className="text-gray-500">No confirmed bookings</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="other">
            <Card>
              <CardHeader>
                <CardTitle>Other Bookings</CardTitle>
              </CardHeader>
              <CardContent>
                {otherBookings.length > 0 ? (
                  <div className="space-y-4">
                    {otherBookings.map((booking) => (
                      <BookingItem 
                        key={booking.id} 
                        booking={booking} 
                        onAddZoomLink={() => handleOpenZoomLinkDialog(booking)} 
                      />
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center">
                    <p className="text-gray-500">No other bookings</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      
      <Dialog open={zoomLinkDialogOpen} onOpenChange={setZoomLinkDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Zoom Meeting Link</DialogTitle>
            <DialogDescription>
              {selectedBooking && (
                <>
                  Session between {selectedBooking.student.name} and {selectedBooking.mentor.name} on{' '}
                  {format(new Date(selectedBooking.scheduled_at), 'MMMM d, yyyy')} at{' '}
                  {format(new Date(selectedBooking.scheduled_at), 'h:mm a')}.
                </>
              )}
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
              This link will be shared with both the student and mentor for the scheduled session.
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
              disabled={isUpdatingLink || !zoomLink}
            >
              {isUpdatingLink ? (
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
      
      <Footer />
    </div>
  );
};

interface BookingItemProps {
  booking: Booking;
  onAddZoomLink: () => void;
}

const BookingItem: React.FC<BookingItemProps> = ({ booking, onAddZoomLink }) => {
  return (
    <div className="border rounded-lg p-4">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <h3 className="font-medium">{booking.booking_option.title}</h3>
            <Badge variant={booking.status === 'confirmed' ? 'default' : booking.status === 'pending' ? 'secondary' : 'outline'}>
              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1 mb-4">
            <p className="text-sm">
              <span className="text-gray-500">Student:</span> {booking.student.name}
            </p>
            <p className="text-sm">
              <span className="text-gray-500">Mentor:</span> {booking.mentor.name}
            </p>
            <p className="text-sm flex items-center gap-1">
              <CalendarIcon className="h-3.5 w-3.5 text-gray-500" />
              {format(new Date(booking.scheduled_at), 'MMMM d, yyyy')}
            </p>
            <p className="text-sm flex items-center gap-1">
              <Clock className="h-3.5 w-3.5 text-gray-500" />
              {format(new Date(booking.scheduled_at), 'h:mm a')} ({booking.booking_option.duration})
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {booking.zoom_link ? (
            <div className="space-x-2">
              <a
                href={booking.zoom_link}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition inline-flex items-center gap-2"
              >
                <VideoIcon className="h-4 w-4" />
                View Meeting
              </a>
              <Button
                variant="outline"
                onClick={onAddZoomLink}
                className="inline-flex items-center gap-2"
              >
                Edit Link
              </Button>
            </div>
          ) : (
            <Button
              onClick={onAddZoomLink}
              className="flex items-center gap-2"
            >
              <VideoIcon className="h-4 w-4" />
              Add Zoom Link
            </Button>
          )}
        </div>
      </div>
      
      {booking.zoom_link && (
        <div className="mt-3 pt-3 border-t">
          <p className="text-xs flex items-center gap-1 text-gray-600">
            <Check className="h-3.5 w-3.5 text-green-500" />
            Zoom link added: <span className="text-blue-600 underline break-all">{booking.zoom_link}</span>
          </p>
        </div>
      )}
    </div>
  );
};

export default BookingManagement;
