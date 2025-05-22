
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { ProfileWithDetails } from "@/types/database";
import AccessDenied from "../insights/universities/components/AccessDenied";

const ProfileManagement = () => {
  const { user, loading, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState<ProfileWithDetails[]>([]);
  const [loadingProfiles, setLoadingProfiles] = useState(true);

  // Fetch all profiles
  const fetchProfiles = async () => {
    setLoadingProfiles(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          school:schools(id, name, location, type, image, created_at),
          major:majors(*),
          activities:profile_activities(activities(*))
        `);

      if (error) {
        throw error;
      }

      const processedProfiles = data.map((profile: any) => {
        // Parse social_links if it's a string
        let socialLinks = profile.social_links;
        if (typeof socialLinks === 'string' && socialLinks) {
          try {
            socialLinks = JSON.parse(socialLinks);
          } catch (error) {
            console.error('Error parsing social links:', error);
            socialLinks = null;
          }
        }
        
        return {
          ...profile,
          school: profile.school ? {
            ...profile.school,
            image: profile.school?.image ?? null
          } : null,
          activities: profile.activities ? profile.activities.map((pa: any) => pa.activities) : [],
          role: profile.role as 'applicant' | 'alumni',
          social_links: socialLinks
        };
      });

      setProfiles(processedProfiles);
    } catch (error) {
      console.error("Error fetching profiles:", error);
      toast.error("Failed to load profiles");
    } finally {
      setLoadingProfiles(false);
    }
  };

  const toggleProfileVisibility = async (profileId: string, currentVisibility: boolean) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ visible: !currentVisibility })
        .eq('id', profileId);

      if (error) {
        throw error;
      }

      toast.success("Profile visibility updated");
      
      // Update local state
      setProfiles(profiles.map(profile => 
        profile.id === profileId 
          ? { ...profile, visible: !currentVisibility } 
          : profile
      ));
    } catch (error) {
      console.error("Error updating profile visibility:", error);
      toast.error("Failed to update profile visibility");
    }
  };

  useEffect(() => {
    if (!loading) {
      if (!user) {
        toast.error("Please sign in to access this page");
        navigate('/auth');
        return;
      }
      
      if (!isAdmin) {
        toast.error("You don't have permission to access this page");
        navigate('/');
        return;
      }

      fetchProfiles();
    }
  }, [user, loading, isAdmin, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return <AccessDenied message="You don't have permission to access this page" />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Profile Management | Admin</title>
      </Helmet>
      <Navbar />
      
      <main className="flex-grow container-custom py-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h1 className="text-3xl font-bold text-navy">Profile Management</h1>
          <div className="flex gap-2 mt-4 md:mt-0">
            <Button
              variant="outline"
              onClick={() => fetchProfiles()}
            >
              Refresh
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/admin/dashboard')}
            >
              Back to Dashboard
            </Button>
          </div>
        </div>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>All Profiles</CardTitle>
          </CardHeader>
          <CardContent>
            {loadingProfiles ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              </div>
            ) : profiles.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>School</TableHead>
                      <TableHead>Major</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Visible in Browse</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {profiles.map((profile) => (
                      <TableRow key={profile.id}>
                        <TableCell className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={profile.image || ""} alt={profile.name || "Profile"} />
                            <AvatarFallback>
                              {(profile.name?.[0] || "U").toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{profile.name}</div>
                            <div className="text-xs text-gray-500">ID: {profile.user_id.substring(0, 8)}...</div>
                          </div>
                        </TableCell>
                        <TableCell>{profile.school?.name || "—"}</TableCell>
                        <TableCell>{profile.major?.name || "—"}</TableCell>
                        <TableCell>
                          <Badge variant={profile.role === 'alumni' ? 'default' : 'outline'}>
                            {profile.role || 'applicant'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Switch 
                            checked={profile.visible === true} 
                            onCheckedChange={() => toggleProfileVisibility(profile.id, !!profile.visible)}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <p className="text-center py-4 text-muted-foreground">No profiles found.</p>
            )}
          </CardContent>
        </Card>
      </main>
      
      <Footer />
    </div>
  );
};

export default ProfileManagement;
