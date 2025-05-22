
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/components/AuthProvider';
import { toast } from 'sonner';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { supabase } from '@/integrations/supabase/client';
import { ProfileWithDetails } from '@/types/database';
import Tag from '@/components/Tag';

export default function MyAccount() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [userProfile, setUserProfile] = useState<ProfileWithDetails | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [profileVisible, setProfileVisible] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) {
        setLoadingProfile(false);
        return;
      }

      try {
        setLoadingProfile(true);
        // Get the profile associated with this user
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select(`
            *,
            school:schools(id, name, location, type, image, created_at),
            major:majors(*),
            activities:profile_activities(activities(*))
          `)
          .eq('user_id', user.id)
          .maybeSingle();

        if (profileError) {
          throw profileError;
        }

        if (profileData) {
          // Parse social_links if it's a string
          let socialLinks = profileData.social_links;
          if (typeof socialLinks === 'string' && socialLinks) {
            try {
              socialLinks = JSON.parse(socialLinks);
            } catch (error) {
              console.error('Error parsing social links:', error);
              socialLinks = null;
            }
          }

          const processedProfile = {
            ...profileData,
            school: profileData.school ? {
              ...profileData.school,
              image: profileData.school?.image ?? null
            } : null,
            activities: profileData.activities ? profileData.activities.map((pa: any) => pa.activities) : [],
            role: profileData.role as 'applicant' | 'alumni',
            social_links: socialLinks
          };

          setUserProfile(processedProfile);
          setProfileVisible(processedProfile.visible !== false); // Default to true if visible is null
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast.error('Failed to load profile information');
      } finally {
        setLoadingProfile(false);
      }
    };

    if (!loading) {
      if (!user) {
        navigate('/auth');
        toast.error('Please sign in to view your account');
      } else {
        fetchUserProfile();
      }
    }
  }, [user, loading, navigate]);

  const toggleProfileVisibility = async () => {
    if (!userProfile) return;
    
    try {
      const newVisibility = !profileVisible;
      const { error } = await supabase
        .from('profiles')
        .update({ visible: newVisibility })
        .eq('id', userProfile.id);

      if (error) throw error;
      
      setProfileVisible(newVisibility);
      toast.success(`Your profile is now ${newVisibility ? 'visible' : 'hidden'} in browse`);
    } catch (error) {
      console.error('Error updating profile visibility:', error);
      toast.error('Failed to update profile visibility');
    }
  };

  const handleEditProfile = () => {
    if (!userProfile) return;
    
    if (userProfile.role === 'alumni' || userProfile.role === 'mentor') {
      navigate('/mentor-dashboard');
    } else {
      navigate('/student-dashboard');
    }
  };

  if (loading || loadingProfile) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="container-custom py-12 flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!user) {
    // Will redirect in useEffect
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>My Account | AlumniSights</title>
      </Helmet>
      <Navbar />
      <main className="container-custom py-10">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-navy">My Account</h1>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-8">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="settings">Account Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>My Profile</CardTitle>
                  <CardDescription>
                    Manage your profile information and visibility
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {userProfile ? (
                    <div className="space-y-8">
                      <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                        <Avatar className="h-24 w-24 border-2 border-white shadow-sm">
                          <AvatarImage src={userProfile.image || undefined} alt={userProfile.name} />
                          <AvatarFallback className="text-lg">{userProfile.name?.charAt(0) || user.email?.charAt(0) || 'U'}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h2 className="text-2xl font-medium">{userProfile.name}</h2>
                          <p className="text-gray-600">{user.email}</p>
                          <div className="flex mt-2 gap-2">
                            <Badge variant={userProfile.role === 'alumni' ? 'default' : 'outline'}>
                              {userProfile.role || 'applicant'}
                            </Badge>
                            {userProfile.graduation_year && (
                              <Badge variant="outline">Class of {userProfile.graduation_year}</Badge>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h3 className="font-medium text-lg mb-2">Education</h3>
                          <dl className="space-y-2">
                            <div>
                              <dt className="text-sm text-gray-500">School</dt>
                              <dd>{userProfile.school?.name || "—"}</dd>
                            </div>
                            <div>
                              <dt className="text-sm text-gray-500">Major</dt>
                              <dd>{userProfile.major?.name || "—"}</dd>
                            </div>
                            <div>
                              <dt className="text-sm text-gray-500">Graduation Year</dt>
                              <dd>{userProfile.graduation_year || "—"}</dd>
                            </div>
                          </dl>
                        </div>

                        <div>
                          <h3 className="font-medium text-lg mb-2">About</h3>
                          <p className="text-gray-700 whitespace-pre-wrap">
                            {userProfile.bio || "No bio provided yet."}
                          </p>
                        </div>
                      </div>

                      {userProfile.activities && userProfile.activities.length > 0 && (
                        <div>
                          <h3 className="font-medium text-lg mb-2">Activities & Interests</h3>
                          <div className="flex flex-wrap gap-2">
                            {userProfile.activities.map((activity: any) => (
                              <Tag key={activity.id} type={activity.type as any}>
                                {activity.name}
                              </Tag>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="pt-4 border-t border-gray-100">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <Label htmlFor="profile-visibility" className="font-medium">
                              Profile Visibility
                            </Label>
                            <p className="text-sm text-gray-500">
                              {profileVisible 
                                ? "Your profile is visible to others in the browse section" 
                                : "Your profile is hidden from the browse section"}
                            </p>
                          </div>
                          <Switch 
                            id="profile-visibility" 
                            checked={profileVisible} 
                            onCheckedChange={toggleProfileVisibility}
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <p className="mb-4">You haven't created a profile yet.</p>
                      <Button onClick={() => navigate('/student-dashboard')}>
                        Create Your Profile
                      </Button>
                    </div>
                  )}
                </CardContent>
                {userProfile && (
                  <CardFooter className="flex justify-end gap-4">
                    <Button onClick={handleEditProfile}>
                      Edit Profile
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
                    Manage your account preferences and security
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-medium text-lg mb-2">Account Information</h3>
                      <dl className="space-y-2">
                        <div>
                          <dt className="text-sm text-gray-500">Email</dt>
                          <dd>{user.email}</dd>
                        </div>
                        <div>
                          <dt className="text-sm text-gray-500">Name</dt>
                          <dd>
                            {user.user_metadata?.first_name
                              ? `${user.user_metadata.first_name} ${user.user_metadata.last_name || ''}`
                              : "Not set"}
                          </dd>
                        </div>
                      </dl>
                    </div>

                    <div className="border-t border-gray-100 pt-4">
                      <Button variant="destructive">Change Password</Button>
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
}
