
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
  DollarSign, 
  Users, 
  CalendarCheck, 
  MessageSquare, 
  TrendingUp
} from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { ProfileWithDetails } from '@/types/database';

const AlumniDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<ProfileWithDetails | null>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [pricingOptions, setPricingOptions] = useState({
    fifteenMin: 0,
    thirtyMin: 25,
    sixtyMin: 50
  });

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    const fetchProfile = async () => {
      setLoading(true);
      try {
        // First check if the user has a profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select(`
            *,
            school:schools(id, name, location, type, image, created_at),
            major:majors(*),
            activities:profile_activities(activities(*))
          `)
          .eq('user_id', user.id)
          .single();

        if (profileError) {
          console.error('Error fetching profile:', profileError);
          toast({
            title: "Error",
            description: "Could not load your profile. Please try again later.",
            variant: "destructive"
          });
          return;
        }

        if (profileData) {
          // Format the profile data
          const formattedProfile = {
            ...profileData,
            school: {
              ...profileData.school,
              image: profileData.school?.image ?? null
            },
            activities: profileData.activities.map((pa: any) => pa.activities)
          };
          
          setProfile(formattedProfile);

          // Fetch the booking options for this profile
          const { data: bookingOptions, error: bookingOptionsError } = await supabase
            .from('booking_options')
            .select('*')
            .eq('profile_id', profileData.id);

          if (!bookingOptionsError && bookingOptions) {
            const pricing = {
              fifteenMin: 0,
              thirtyMin: 25,
              sixtyMin: 50
            };

            bookingOptions.forEach((option: any) => {
              if (option.duration === '15 min') {
                pricing.fifteenMin = option.price;
              } else if (option.duration === '30 min') {
                pricing.thirtyMin = option.price;
              } else if (option.duration === '60 min') {
                pricing.sixtyMin = option.price;
              }
            });

            setPricingOptions(pricing);
          }

          // Fetch bookings for this profile
          const { data: bookingsData, error: bookingsError } = await supabase
            .from('bookings')
            .select(`
              *,
              booking_option:booking_options(*)
            `)
            .eq('profile_id', profileData.id);

          if (!bookingsError && bookingsData) {
            setBookings(bookingsData);
          }
        } else {
          // No profile found, redirect to profile creation
          navigate('/profile/complete');
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

    fetchProfile();
  }, [user, navigate]);

  const handlePricingUpdate = async (type: 'fifteenMin' | 'thirtyMin' | 'sixtyMin', value: number) => {
    if (!profile) return;

    try {
      // Update local state first for immediate feedback
      setPricingOptions(prev => ({
        ...prev,
        [type]: value
      }));

      // Map the pricing type to duration format for the database
      const durationMap = {
        fifteenMin: '15 min',
        thirtyMin: '30 min',
        sixtyMin: '60 min'
      };

      // Check if this option already exists
      const { data: existingOptions } = await supabase
        .from('booking_options')
        .select('*')
        .eq('profile_id', profile.id)
        .eq('duration', durationMap[type])
        .single();

      if (existingOptions) {
        // Update existing option
        await supabase
          .from('booking_options')
          .update({ price: value })
          .eq('id', existingOptions.id);
      } else {
        // Create new option
        await supabase
          .from('booking_options')
          .insert({
            profile_id: profile.id,
            title: `${durationMap[type]} Consultation`,
            description: `A ${durationMap[type]} consultation session.`,
            duration: durationMap[type],
            price: value
          });
      }

      toast({
        title: "Success",
        description: "Your pricing has been updated.",
      });
    } catch (error) {
      console.error('Error updating pricing:', error);
      toast({
        title: "Error",
        description: "Could not update pricing. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="container-custom py-20 text-center">
          <div className="animate-pulse flex flex-col items-center">
            <div className="w-32 h-32 bg-gray-200 rounded-full mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>
            <div className="h-24 bg-gray-200 rounded w-full max-w-2xl"></div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="container-custom py-20 text-center">
          <h1 className="text-3xl md:text-4xl font-medium mb-6">Profile Not Found</h1>
          <p className="text-gray-600 mb-8">
            You don't have a profile yet. Create one to access your dashboard.
          </p>
          <button 
            onClick={() => navigate('/profile/complete')}
            className="px-6 py-3 bg-navy text-white rounded-md hover:bg-navy/90 transition-colors"
          >
            Create Profile
          </button>
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
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
              <p className="text-gray-500">
                Welcome back, {profile.name}!
              </p>
            </div>
            <button 
              onClick={() => navigate(`/profile/${profile.id}`)}
              className="px-4 py-2 bg-navy text-white rounded-md hover:bg-navy/90 transition-colors"
            >
              View Public Profile
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Earnings
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${bookings.reduce((total, booking) => {
                    return total + (booking.booking_option?.price || 0);
                  }, 0)}
                </div>
                <p className="text-xs text-muted-foreground">
                  {bookings.filter(b => b.status === 'completed').length} completed sessions
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Students
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {new Set(bookings.map(b => b.user_id)).size}
                </div>
                <p className="text-xs text-muted-foreground">
                  Unique students you've helped
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Pending Bookings
                </CardTitle>
                <CalendarCheck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {bookings.filter(b => b.status === 'pending').length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Sessions awaiting confirmation
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Completion Rate
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {bookings.length > 0 
                    ? Math.round((bookings.filter(b => b.status === 'completed').length / bookings.length) * 100)
                    : 0}%
                </div>
                <p className="text-xs text-muted-foreground">
                  Sessions completed vs. booked
                </p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="bookings" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="bookings">Bookings</TabsTrigger>
              <TabsTrigger value="pricing">Pricing</TabsTrigger>
              <TabsTrigger value="messages">Messages</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="bookings">
              <Card>
                <CardHeader>
                  <CardTitle>Manage Bookings</CardTitle>
                  <CardDescription>
                    View and manage your consultation bookings.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {bookings.length === 0 ? (
                    <div className="text-center py-12">
                      <CalendarCheck className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium mb-2">No bookings yet</h3>
                      <p className="text-sm text-gray-500 max-w-md mx-auto">
                        You don't have any bookings yet. When students book sessions with you, they'll appear here.
                      </p>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Duration</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {bookings.map((booking) => (
                          <TableRow key={booking.id}>
                            <TableCell>{new Date(booking.scheduled_at).toLocaleDateString()}</TableCell>
                            <TableCell>{booking.booking_option?.duration}</TableCell>
                            <TableCell>${booking.booking_option?.price}</TableCell>
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
                                <button className="text-sm text-navy hover:underline">
                                  View
                                </button>
                                {booking.status === 'pending' && (
                                  <>
                                    <button className="text-sm text-green-600 hover:underline">
                                      Accept
                                    </button>
                                    <button className="text-sm text-red-600 hover:underline">
                                      Decline
                                    </button>
                                  </>
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
            
            <TabsContent value="pricing">
              <Card>
                <CardHeader>
                  <CardTitle>Manage Pricing</CardTitle>
                  <CardDescription>
                    Set your consultation rates for different session durations.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">15 Minute Chat</CardTitle>
                          <CardDescription>Quick introduction call</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center">
                            <DollarSign className="h-4 w-4 text-muted-foreground mr-1" />
                            <input 
                              type="number" 
                              min="0"
                              value={pricingOptions.fifteenMin}
                              onChange={(e) => setPricingOptions(prev => ({
                                ...prev,
                                fifteenMin: parseInt(e.target.value) || 0
                              }))}
                              onBlur={() => handlePricingUpdate('fifteenMin', pricingOptions.fifteenMin)}
                              className="w-full border rounded-md px-3 py-2 text-lg font-bold"
                            />
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">30 Minute Consultation</CardTitle>
                          <CardDescription>In-depth discussion</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center">
                            <DollarSign className="h-4 w-4 text-muted-foreground mr-1" />
                            <input 
                              type="number" 
                              min="0"
                              value={pricingOptions.thirtyMin}
                              onChange={(e) => setPricingOptions(prev => ({
                                ...prev,
                                thirtyMin: parseInt(e.target.value) || 0
                              }))}
                              onBlur={() => handlePricingUpdate('thirtyMin', pricingOptions.thirtyMin)}
                              className="w-full border rounded-md px-3 py-2 text-lg font-bold"
                            />
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">60 Minute Mentoring</CardTitle>
                          <CardDescription>Comprehensive guidance</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center">
                            <DollarSign className="h-4 w-4 text-muted-foreground mr-1" />
                            <input 
                              type="number" 
                              min="0"
                              value={pricingOptions.sixtyMin}
                              onChange={(e) => setPricingOptions(prev => ({
                                ...prev,
                                sixtyMin: parseInt(e.target.value) || 0
                              }))}
                              onBlur={() => handlePricingUpdate('sixtyMin', pricingOptions.sixtyMin)}
                              className="w-full border rounded-md px-3 py-2 text-lg font-bold"
                            />
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                    
                    <div className="bg-blue-50 p-4 rounded-md">
                      <h3 className="font-medium text-blue-800 mb-2">Pricing Tips</h3>
                      <ul className="text-sm text-blue-700 space-y-1">
                        <li>Consider your experience and expertise when setting prices</li>
                        <li>Research what others in your field are charging</li>
                        <li>You can offer the 15-minute session for free to attract more students</li>
                        <li>Prices can be updated at any time</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="messages">
              <Card>
                <CardHeader>
                  <CardTitle>Messages</CardTitle>
                  <CardDescription>
                    Communicate with your students.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <MessageSquare className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium mb-2">Messaging coming soon</h3>
                    <p className="text-sm text-gray-500 max-w-md mx-auto">
                      We're working on a messaging system to help you communicate with your students more effectively. Stay tuned!
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Settings</CardTitle>
                  <CardDescription>
                    Manage your profile visibility and settings.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Profile Visibility</h3>
                        <p className="text-sm text-gray-500">Make your profile visible to students</p>
                      </div>
                      <div className="flex items-center">
                        <input 
                          type="checkbox" 
                          className="w-5 h-5 rounded border-gray-300 text-navy focus:ring-navy"
                          checked={true}
                          readOnly
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Email Notifications</h3>
                        <p className="text-sm text-gray-500">Receive email notifications for new bookings</p>
                      </div>
                      <div className="flex items-center">
                        <input 
                          type="checkbox" 
                          className="w-5 h-5 rounded border-gray-300 text-navy focus:ring-navy"
                          checked={true}
                          readOnly
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Featured Profile</h3>
                        <p className="text-sm text-gray-500">Apply to be featured on our homepage</p>
                      </div>
                      <button className="px-3 py-1 bg-navy text-white text-sm rounded hover:bg-navy/90 transition-colors">
                        Apply
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AlumniDashboard;
