
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { ProfileWithDetails } from '@/types/database';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { toast } from 'sonner';
import { Loader2, User, PenSquare, School, BookOpen, MapPin, Briefcase, Award } from 'lucide-react';

const MyAccount = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<ProfileWithDetails | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  useEffect(() => {
    // Redirect if not logged in
    if (!loading && !user) {
      navigate('/auth');
      return;
    }

    // Fetch user profile if logged in
    if (user) {
      const fetchProfile = async () => {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select(`
              *,
              school:schools(*),
              major:majors(*),
              activities:profile_activities(activities(*)),
              greek_life:profile_greek_life(greek_life(*))
            `)
            .eq('user_id', user.id)
            .single();

          if (error) {
            console.error('Error fetching profile:', error);
            toast.error('Failed to load your profile');
          } else if (data) {
            // Transform the data to match ProfileWithDetails
            const profileData: ProfileWithDetails = {
              ...data,
              school: data.school || { id: '', name: '', location: null, type: null, image: null },
              major: data.major || { id: '', name: '', category: null },
              activities: data.activities?.map((pa: any) => pa.activities) || [],
              // Cast role to the expected type with a fallback
              role: (data.role === 'alumni' || data.role === 'applicant' 
                ? data.role as 'applicant' | 'alumni' 
                : 'applicant'),
              social_links: typeof data.social_links === 'string' && data.social_links 
                ? JSON.parse(data.social_links) 
                : (data.social_links || null),
              greek_life: data.greek_life?.length > 0 
                ? data.greek_life[0].greek_life 
                : null
            };
            setProfile(profileData);
          }
        } catch (error) {
          console.error('Error in profile fetch:', error);
        } finally {
          setIsLoadingProfile(false);
        }
      };

      fetchProfile();
    }
  }, [user, loading, navigate]);

  if (loading || isLoadingProfile) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-10 w-10 animate-spin mx-auto text-primary" />
            <p className="mt-4 text-lg">Loading your account...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const getInitials = (name: string | null) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const metadata = user?.user_metadata || {};
  const userRole = metadata?.role || 'user';
  const roleName = userRole === 'applicant' 
    ? 'Applicant' 
    : userRole === 'alumni' 
      ? 'Alumni/Mentor' 
      : userRole === 'admin' 
        ? 'Administrator' 
        : 'User';

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">My Account</h1>

          <Tabs defaultValue="profile">
            <TabsList className="mb-6">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <Card className="mb-8">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>User Profile</CardTitle>
                    {profile && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => navigate(
                          userRole === 'applicant' 
                            ? '/applicant-profile-complete' 
                            : '/profile-complete'
                        )}
                      >
                        <PenSquare className="h-4 w-4 mr-2" /> Edit Profile
                      </Button>
                    )}
                  </div>
                  <CardDescription>
                    Your personal information and profile details
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col md:flex-row gap-8">
                    <div className="flex flex-col items-center">
                      <Avatar className="h-32 w-32 mb-4">
                        {profile?.image ? (
                          <AvatarImage src={profile.image} alt={profile.name} />
                        ) : (
                          <AvatarFallback className="text-2xl">
                            {getInitials(user?.user_metadata?.first_name + ' ' + user?.user_metadata?.last_name)}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <h3 className="text-lg font-semibold">{metadata.first_name} {metadata.last_name}</h3>
                      <p className="text-gray-500">{user?.email}</p>
                      <span className="inline-block mt-2 px-3 py-1 rounded-full text-xs bg-primary/10 text-primary">
                        {roleName}
                      </span>
                    </div>

                    <div className="flex-1">
                      {!profile ? (
                        <div className="bg-amber-50 border border-amber-200 rounded-md p-4 text-amber-800 mt-4">
                          <p className="font-medium">Your profile is not complete</p>
                          <p className="mt-2 text-sm">
                            Please complete your profile to get the most out of our platform.
                          </p>
                          <Button 
                            className="mt-4" 
                            onClick={() => navigate(
                              userRole === 'applicant' 
                                ? '/applicant-profile-complete' 
                                : '/profile-complete'
                            )}
                          >
                            Complete Profile
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {profile.bio && (
                            <div>
                              <h3 className="text-sm font-medium text-gray-500 mb-1">Bio</h3>
                              <p className="whitespace-pre-line">{profile.bio}</p>
                            </div>
                          )}
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            {profile.school && (
                              <div className="flex items-center gap-2">
                                <School className="h-5 w-5 text-gray-400" />
                                <div>
                                  <p className="text-sm font-medium">University</p>
                                  <p>{profile.school.name}</p>
                                </div>
                              </div>
                            )}
                            
                            {profile.major && (
                              <div className="flex items-center gap-2">
                                <BookOpen className="h-5 w-5 text-gray-400" />
                                <div>
                                  <p className="text-sm font-medium">Major</p>
                                  <p>{profile.major.name}</p>
                                </div>
                              </div>
                            )}
                            
                            {profile.location && (
                              <div className="flex items-center gap-2">
                                <MapPin className="h-5 w-5 text-gray-400" />
                                <div>
                                  <p className="text-sm font-medium">Location</p>
                                  <p>{profile.location}</p>
                                </div>
                              </div>
                            )}
                            
                            {profile.graduation_year && (
                              <div className="flex items-center gap-2">
                                <Award className="h-5 w-5 text-gray-400" />
                                <div>
                                  <p className="text-sm font-medium">Graduation Year</p>
                                  <p>{profile.graduation_year}</p>
                                </div>
                              </div>
                            )}
                          </div>
                          
                          {profile.activities && profile.activities.length > 0 && (
                            <div className="mt-4">
                              <h3 className="text-sm font-medium text-gray-500 mb-2">Activities & Interests</h3>
                              <div className="flex flex-wrap gap-2">
                                {profile.activities.map((activityItem: any) => (
                                  <span 
                                    key={activityItem.activities.id} 
                                    className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs"
                                  >
                                    {activityItem.activities.name}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
                {userRole === 'alumni' && profile && (
                  <CardFooter className="flex justify-end border-t pt-4">
                    <Button 
                      variant="outline"
                      onClick={() => navigate('/mentor-dashboard')}
                    >
                      Go to Mentor Dashboard
                    </Button>
                  </CardFooter>
                )}
              </Card>
            </TabsContent>

            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                  <CardDescription>
                    Manage your account preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Email Address</h3>
                    <p className="text-gray-600">{user?.email}</p>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">Account Type</h3>
                    <p className="text-gray-600">{roleName}</p>
                  </div>

                  <Separator />
                  
                  <div>
                    <h3 className="text-lg font-medium mb-4">Danger Zone</h3>
                    <Button variant="destructive">
                      Delete Account
                    </Button>
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
