
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/components/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  Calendar,
  CheckCircle,
  MessageSquare,
  BookOpen,
  BookUser
} from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { ProfileWithDetails } from '@/types/database';

const ApplicantDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [progressSteps, setProgressSteps] = useState([
    { id: 1, title: 'Create Account', completed: true },
    { id: 2, title: 'Browse Profiles', completed: false },
    { id: 3, title: 'Book Session', completed: false },
    { id: 4, title: 'Complete Session', completed: false },
    { id: 5, title: 'Apply to Schools', completed: false }
  ]);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    const fetchBookings = async () => {
      setLoading(true);
      try {
        // Fetch all bookings made by this user
        const { data: bookingsData, error: bookingsError } = await supabase
          .from('bookings')
          .select(`
            *,
            profile:profiles(
              id,
              name,
              image,
              school:schools(id, name),
              major:majors(*)
            ),
            booking_option:booking_options(*)
          `)
          .eq('user_id', user.id);

        if (bookingsError) {
          console.error('Error fetching bookings:', bookingsError);
          toast({
            title: "Error",
            description: "Could not load your bookings. Please try again later.",
            variant: "destructive"
          });
          return;
        }

        if (bookingsData) {
          setBookings(bookingsData);
          
          // Update progress steps based on bookings
          if (bookingsData.length > 0) {
            setProgressSteps(prev => {
              const updated = [...prev];
              updated[1].completed = true; // Browse Profiles
              updated[2].completed = true; // Book Session
              
              if (bookingsData.some(b => b.status === 'completed')) {
                updated[3].completed = true; // Complete Session
              }
              
              return updated;
            });
          }
        }
      } catch (error) {
        console.error('Error in dashboard setup:', error);
        toast({
          title: "Error",
          description: "An unexpected error occurred. Please try again.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="container-custom py-20 text-center">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>
            <div className="h-24 bg-gray-200 rounded w-full max-w-2xl"></div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="py-12">
        <div className="container-custom">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Your Dashboard</h1>
            <p className="text-gray-500">
              Track your progress and manage your bookings
            </p>
          </div>

          <div className="mb-10">
            <h2 className="text-xl font-semibold mb-4">Your Journey</h2>
            <div className="relative">
              <div className="absolute left-0 right-0 h-1 top-5 bg-gray-200">
                <div 
                  className="h-full bg-navy" 
                  style={{ 
                    width: `${(progressSteps.filter(step => step.completed).length / progressSteps.length) * 100}%` 
                  }}
                ></div>
              </div>
              <div className="relative flex justify-between">
                {progressSteps.map((step) => (
                  <div key={step.id} className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center relative z-10 ${
                      step.completed ? 'bg-navy text-white' : 'bg-white border-2 border-gray-300 text-gray-400'
                    }`}>
                      {step.completed ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        step.id
                      )}
                    </div>
                    <span className={`text-xs mt-2 text-center w-20 ${
                      step.completed ? 'text-navy font-medium' : 'text-gray-500'
                    }`}>
                      {step.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <Tabs defaultValue="bookings" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="bookings">My Bookings</TabsTrigger>
              <TabsTrigger value="messages">Messages</TabsTrigger>
              <TabsTrigger value="resources">Resources</TabsTrigger>
            </TabsList>
            
            <TabsContent value="bookings">
              <Card>
                <CardHeader>
                  <CardTitle>Your Bookings</CardTitle>
                  <CardDescription>
                    Manage your consultation sessions with alumni.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {bookings.length === 0 ? (
                    <div className="text-center py-12">
                      <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium mb-2">No bookings yet</h3>
                      <p className="text-sm text-gray-500 max-w-md mx-auto">
                        You haven't booked any sessions with alumni yet. Browse profiles to find alumni who can help you.
                      </p>
                      <button 
                        onClick={() => navigate('/browse')}
                        className="mt-4 px-4 py-2 bg-navy text-white rounded-md hover:bg-navy/90 transition-colors"
                      >
                        Browse Alumni
                      </button>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Alumni</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Duration</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {bookings.map((booking) => (
                          <TableRow key={booking.id}>
                            <TableCell>
                              <div className="flex items-center space-x-3">
                                <img 
                                  src={booking.profile?.image || '/placeholder.svg'} 
                                  alt={booking.profile?.name} 
                                  className="h-8 w-8 rounded-full object-cover"
                                />
                                <div>
                                  <div className="font-medium">{booking.profile?.name}</div>
                                  <div className="text-xs text-gray-500">{booking.profile?.school?.name}</div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>{new Date(booking.scheduled_at).toLocaleDateString()}</TableCell>
                            <TableCell>{booking.booking_option?.duration}</TableCell>
                            <TableCell>
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                booking.status === 'completed' ? 'bg-green-100 text-green-800' :
                                booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                'bg-blue-100 text-blue-800'
                              }`}>
                                {booking.status}
                              </span>
                            </TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <button 
                                  onClick={() => navigate(`/profile/${booking.profile?.id}`)}
                                  className="text-sm text-navy hover:underline"
                                >
                                  View Profile
                                </button>
                                {booking.status === 'confirmed' && (
                                  <button className="text-sm text-red-600 hover:underline">
                                    Cancel
                                  </button>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="messages">
              <Card>
                <CardHeader>
                  <CardTitle>Messages</CardTitle>
                  <CardDescription>
                    Communicate with alumni and advisors.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <MessageSquare className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium mb-2">Messaging coming soon</h3>
                    <p className="text-sm text-gray-500 max-w-md mx-auto">
                      We're working on a messaging system to help you communicate with alumni more effectively. Stay tuned!
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="resources">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Application Resources</CardTitle>
                    <CardDescription>
                      Guides and resources to help with your applications.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-4">
                      <li className="flex items-center space-x-3">
                        <BookOpen className="h-5 w-5 text-navy" />
                        <div>
                          <h4 className="font-medium">Essay Writing Guide</h4>
                          <p className="text-sm text-gray-500">Tips for crafting compelling essays</p>
                        </div>
                      </li>
                      <li className="flex items-center space-x-3">
                        <BookOpen className="h-5 w-5 text-navy" />
                        <div>
                          <h4 className="font-medium">Interview Preparation</h4>
                          <p className="text-sm text-gray-500">Common questions and how to answer them</p>
                        </div>
                      </li>
                      <li className="flex items-center space-x-3">
                        <BookOpen className="h-5 w-5 text-navy" />
                        <div>
                          <h4 className="font-medium">Application Timeline</h4>
                          <p className="text-sm text-gray-500">Key dates and deadlines to remember</p>
                        </div>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Recommended Alumni</CardTitle>
                    <CardDescription>
                      Alumni who might be helpful based on your interests.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <BookUser className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium mb-2">Personalized recommendations coming soon</h3>
                      <p className="text-sm text-gray-500 max-w-md mx-auto">
                        We'll analyze your interests and goals to recommend alumni who can help you achieve your academic goals.
                      </p>
                      <button 
                        onClick={() => navigate('/browse')}
                        className="mt-4 px-4 py-2 bg-navy text-white rounded-md hover:bg-navy/90 transition-colors"
                      >
                        Browse All Alumni
                      </button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ApplicantDashboard;
