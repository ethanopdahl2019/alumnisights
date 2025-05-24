import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { User, Calendar, BadgeCheck, ShieldCheck, Key, Eye, EyeOff } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { ProfileWithDetails } from "@/types/database";

const MyAccount = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [profile, setProfile] = useState<ProfileWithDetails | null>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [badges, setBadges] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [accessCode, setAccessCode] = useState("");
  const [requestType, setRequestType] = useState("admin");
  const [requestReason, setRequestReason] = useState("");
  const [accessDialogOpen, setAccessDialogOpen] = useState(false);
  const [requestDialogOpen, setRequestDialogOpen] = useState(false);
  const [updating, setUpdating] = useState(false);
  const isAdmin = user?.user_metadata?.role === 'admin';
  const isMentor = user?.user_metadata?.role === 'mentor' || user?.user_metadata?.role === 'alumni';

  useEffect(() => {
    if (!user && !loading) {
      toast.error("Please sign in to view your account");
      navigate("/auth");
      return;
    }

    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        // Fetch profile data
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*, school:schools(id, name, location, type, image), major:majors(id, name, category)")
          .eq("user_id", user?.id)
          .single();

        if (profileError) throw profileError;
        
        // Parse social links if it's a string
        let socialLinks = profileData.social_links;
        if (typeof socialLinks === 'string' && socialLinks) {
          try {
            socialLinks = JSON.parse(socialLinks);
          } catch (error) {
            console.error('Error parsing social links:', error);
            socialLinks = null;
          }
        }

        // Make sure social_links isn't a number or null
        if (typeof socialLinks === 'number' || socialLinks === null) {
          socialLinks = {};
        }
        
        const profileWithDetails: ProfileWithDetails = {
          ...profileData,
          social_links: socialLinks,
          // Ensure role is properly typed
          role: (profileData.role || 'applicant') as 'applicant' | 'alumni' | 'mentor',
          // Ensure other required properties are present
          school: profileData.school || { 
            id: '',
            name: 'Not specified',
            location: null,
            type: null,
            image: null
          },
          major: profileData.major || { 
            id: '',
            name: 'Not specified',
            category: null
          },
          activities: [] // Initialize with empty array if not present
        };

        setProfile(profileWithDetails);

        // Fetch user's bookings
        const { data: bookingsData, error: bookingsError } = await supabase
          .from("bookings")
          .select(`
            *,
            booking_option:booking_options(*),
            profile:profiles(id, name, image, school:schools(name))
          `)
          .eq("user_id", user?.id)
          .order("scheduled_at", { ascending: false });

        if (bookingsError) throw bookingsError;
        setBookings(bookingsData || []);

        // Fetch user's badges (from user_tags table)
        const { data: badgesData, error: badgesError } = await supabase
          .from("user_tags")
          .select("*, tag:tags(*)")
          .eq("user_id", user?.id);

        if (badgesError) throw badgesError;
        setBadges(badgesData || []);

      } catch (error) {
        console.error("Error fetching account data:", error);
        toast.error("Failed to load account data");
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchUserData();
    }
  }, [user, loading, navigate]);

  const handleAccessCodeSubmit = async () => {
    setIsLoading(true);
    try {
      // Check if the access code matches (hardcoded for now: "password")
      if (accessCode === "password") {
        // Update user metadata to make them an admin
        const { data, error } = await supabase.auth.updateUser({
          data: { role: 'admin' }
        });

        if (error) throw error;
        
        toast.success("Admin access granted!");
        
        // Reload the page to reflect the changes
        window.location.reload();
      } else {
        toast.error("Invalid access code");
      }
    } catch (error) {
      console.error("Error granting admin access:", error);
      toast.error("Failed to process access code");
    } finally {
      setIsLoading(false);
      setAccessDialogOpen(false);
    }
  };

  const handleRequestSubmit = async () => {
    setIsLoading(true);
    try {
      // Create a new admin request in the database
      // Use type assertion with 'as any' to bypass TypeScript checking for now
      const { error } = await (supabase
        .from("admin_requests" as any)
        .insert({
          user_id: user?.id,
          request_type: requestType,
          reason: requestReason,
          status: 'pending'
        } as any));

      if (error) throw error;
      
      toast.success(`Your request for ${requestType} status has been submitted!`);
    } catch (error) {
      console.error("Error submitting request:", error);
      toast.error("Failed to submit request");
    } finally {
      setIsLoading(false);
      setRequestDialogOpen(false);
      setRequestReason("");
    }
  };

  const toggleProfileVisibility = async () => {
    if (!profile) return;
    
    setUpdating(true);
    try {
      // Update the profile's visibility in the database
      const newVisibility = !profile.visible;
      
      const { error } = await supabase
        .from("profiles")
        .update({ visible: newVisibility })
        .eq("id", profile.id);

      if (error) throw error;
      
      // Update the local state
      setProfile({
        ...profile,
        visible: newVisibility
      });
      
      toast.success(newVisibility ? 
        "Your profile is now visible in browse" : 
        "Your profile is now hidden from browse");
    } catch (error) {
      console.error("Error updating profile visibility:", error);
      toast.error("Failed to update profile visibility");
    } finally {
      setUpdating(false);
    }
  };

  const completeProfileForBrowse = () => {
    navigate("/profile-complete");
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="container-custom py-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy mx-auto"></div>
          <p className="mt-4 text-navy">Loading your account information...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return null; // Redirect handled in useEffect
  }

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short'
    }).format(date);
  };

  // Check if the profile is complete for browse visibility
  const hasCompleteProfile = () => {
    if (!profile) return false;
    
    return !!(
      profile.name && 
      profile.school_id && 
      profile.major_id && 
      profile.bio && 
      profile.graduation_year
    );
  };

  const isProfileComplete = hasCompleteProfile();

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>My Account | AlumniSights</title>
        <meta name="description" content="View your account details, bookings, and badges" />
      </Helmet>

      <Navbar />
      
      <main className="container-custom py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-navy mb-2">My Account</h1>
          <p className="text-gray-600 mb-8">View and manage your account details</p>
          
          <Tabs defaultValue="personal-info" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="personal-info">
                <User className="h-4 w-4 mr-2" /> Personal Info
              </TabsTrigger>
              <TabsTrigger value="bookings">
                <Calendar className="h-4 w-4 mr-2" /> Bookings
              </TabsTrigger>
              <TabsTrigger value="badges">
                <BadgeCheck className="h-4 w-4 mr-2" /> Badges
              </TabsTrigger>
              <TabsTrigger value="account-status">
                <ShieldCheck className="h-4 w-4 mr-2" /> Account Status
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="personal-info" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>
                    Your personal details and profile information
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      {profile?.image ? (
                        <img 
                          src={profile.image} 
                          alt="Profile" 
                          className="h-16 w-16 rounded-full object-cover border border-gray-200"
                        />
                      ) : (
                        <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center">
                          <User className="h-8 w-8 text-gray-400" />
                        </div>
                      )}
                      <div>
                        <h3 className="font-semibold text-lg">
                          {profile?.name || user.user_metadata?.first_name || "User"}
                        </h3>
                        <p className="text-gray-600">{user.email}</p>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Role</p>
                        <p>{profile?.role || "Applicant"}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Location</p>
                        <p>{profile?.location || "Not specified"}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">School</p>
                        <p>{profile?.school?.name || "Not specified"}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Major</p>
                        <p>{profile?.major?.name || "Not specified"}</p>
                      </div>
                      {profile?.graduation_year && (
                        <div>
                          <p className="text-sm font-medium text-gray-500">Graduation Year</p>
                          <p>{profile.graduation_year}</p>
                        </div>
                      )}
                      {profile?.headline && (
                        <div className="col-span-2">
                          <p className="text-sm font-medium text-gray-500">Headline</p>
                          <p>{profile.headline}</p>
                        </div>
                      )}
                    </div>
                    
                    {profile?.bio && (
                      <>
                        <Separator />
                        <div>
                          <p className="text-sm font-medium text-gray-500">Bio</p>
                          <p className="whitespace-pre-line">{profile.bio}</p>
                        </div>
                      </>
                    )}

                    {/* Mentor-specific profile visibility controls */}
                    {isMentor && (
                      <>
                        <Separator />
                        <div className="space-y-4">
                          <h4 className="font-medium">Profile Visibility</h4>
                          
                          {isProfileComplete ? (
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium">Visible in Browse</p>
                                <p className="text-sm text-gray-500">
                                  Allow students to find and book sessions with you
                                </p>
                              </div>
                              <Switch
                                checked={!!profile?.visible}
                                onCheckedChange={toggleProfileVisibility}
                                disabled={updating}
                                className="data-[state=checked]:bg-green-500"
                              />
                            </div>
                          ) : (
                            <div className="rounded-lg bg-amber-50 p-4 border border-amber-200">
                              <h5 className="font-medium text-amber-800 flex items-center">
                                <EyeOff className="h-5 w-5 mr-2" /> 
                                Complete your profile to be visible
                              </h5>
                              <p className="text-sm text-amber-700 mt-1 mb-3">
                                You need to complete your profile information before it can be made visible in browse.
                              </p>
                              <Button 
                                onClick={completeProfileForBrowse}
                                variant="outline" 
                                className="border-amber-400 hover:bg-amber-100"
                              >
                                Complete Profile
                              </Button>
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="bookings" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Your Bookings</CardTitle>
                  <CardDescription>
                    Sessions you've booked with alumni
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {bookings.length > 0 ? (
                    <div className="space-y-4">
                      {bookings.map((booking) => (
                        <div 
                          key={booking.id} 
                          className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border rounded-md"
                        >
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              {booking.profile?.image ? (
                                <img 
                                  src={booking.profile.image} 
                                  alt={booking.profile.name} 
                                  className="h-8 w-8 rounded-full object-cover"
                                />
                              ) : (
                                <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                                  <User className="h-4 w-4 text-gray-400" />
                                </div>
                              )}
                              <h3 className="font-medium">{booking.profile?.name}</h3>
                            </div>
                            <p className="text-sm text-gray-600">
                              {booking.booking_option?.title} ({booking.booking_option?.duration})
                            </p>
                            <p className="text-sm text-gray-600">
                              {formatDateTime(booking.scheduled_at)}
                            </p>
                          </div>
                          
                          <Badge 
                            className="mt-2 sm:mt-0"
                            variant={booking.status === 'confirmed' ? 'default' : 
                              booking.status === 'pending' ? 'secondary' : 'outline'}
                          >
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-gray-500">You don't have any bookings yet</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="badges" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Your Badges</CardTitle>
                  <CardDescription>
                    Special badges and recognitions earned
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {badges.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {badges.map((badge) => (
                        <Badge key={badge.id} className="py-2 px-3">
                          {badge.tag?.name}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-gray-500">You don't have any badges yet</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="account-status" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Account Status</CardTitle>
                  <CardDescription>
                    Information about your account access and privileges
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <div className="mr-4">
                        {isAdmin ? (
                          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                            <ShieldCheck className="h-5 w-5 text-blue-600" />
                          </div>
                        ) : (
                          <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                            <User className="h-5 w-5 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-medium">
                          {isAdmin ? "Administrator Account" : "Standard Account"}
                        </p>
                        <p className="text-sm text-gray-600">
                          {isAdmin 
                            ? "You have administrative privileges on the platform" 
                            : "You have standard user access to the platform"}
                        </p>
                      </div>
                    </div>
                    
                    {isAdmin && (
                      <div className="bg-blue-50 p-4 rounded-md mt-4">
                        <p className="text-sm">
                          As an administrator, you have access to the {" "}
                          <a 
                            href="/admin/dashboard" 
                            className="text-blue-600 font-medium hover:underline"
                          >
                            Admin Dashboard
                          </a>
                          {" "} where you can manage users, content, and site analytics.
                        </p>
                      </div>
                    )}
                    
                    <div className="pt-4 space-y-3">
                      <Dialog open={accessDialogOpen} onOpenChange={setAccessDialogOpen}>
                        <DialogTrigger asChild>
                          <Button variant="outline" className="w-full flex items-center">
                            <Key className="mr-2 h-4 w-4" />
                            Enter Access Code
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Enter Admin Access Code</DialogTitle>
                            <DialogDescription>
                              Enter the admin access code to gain administrator privileges.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="py-4">
                            <Input
                              type="password"
                              placeholder="Access Code"
                              value={accessCode}
                              onChange={(e) => setAccessCode(e.target.value)}
                              className="mb-2"
                            />
                          </div>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setAccessDialogOpen(false)}>
                              Cancel
                            </Button>
                            <Button onClick={handleAccessCodeSubmit}>
                              Submit
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>

                      <Dialog open={requestDialogOpen} onOpenChange={setRequestDialogOpen}>
                        <DialogTrigger asChild>
                          <Button variant="outline" className="w-full">
                            Request Special Status
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Request Special Status</DialogTitle>
                            <DialogDescription>
                              Submit a request for verified status or admin privileges.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="py-4 space-y-4">
                            <RadioGroup value={requestType} onValueChange={setRequestType}>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="admin" id="admin" />
                                <Label htmlFor="admin">Admin Status</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="verified" id="verified" />
                                <Label htmlFor="verified">Verified Status</Label>
                              </div>
                            </RadioGroup>
                            
                            <div className="space-y-2">
                              <Label htmlFor="reason">Reason for Request</Label>
                              <textarea
                                id="reason"
                                placeholder="Please explain why you are requesting this status..."
                                value={requestReason}
                                onChange={(e) => setRequestReason(e.target.value)}
                                className="w-full min-h-[100px] p-2 border rounded-md"
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setRequestDialogOpen(false)}>
                              Cancel
                            </Button>
                            <Button onClick={handleRequestSubmit} disabled={!requestReason.trim()}>
                              Submit Request
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
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

export default MyAccount;
