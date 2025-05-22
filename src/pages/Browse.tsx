
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const Browse = () => {
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        // Get all users from the profiles table without restrictions
        const { data, error } = await supabase
          .from('profiles')
          .select(`
            *,
            school:schools(*),
            major:majors(*)
          `);

        if (error) {
          throw error;
        }

        if (data) {
          console.log('[Browse] Loaded profiles:', data.length);
          setProfiles(data);
        }
      } catch (error) {
        console.error('Error fetching profiles:', error);
        toast.error('Failed to load profiles');
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, []);

  const getInitials = (name: string | null) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-10 w-10 animate-spin mx-auto text-primary" />
            <p className="mt-4 text-lg">Loading profiles...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="container mx-auto py-12 px-4 flex-grow">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Browse All Profiles</h1>

          {profiles.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600">No profiles found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {profiles.map((profile) => (
                <Card key={profile.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center text-center">
                      <Avatar className="h-24 w-24 mb-4">
                        {profile.image ? (
                          <AvatarImage src={profile.image} alt={profile.name} />
                        ) : (
                          <AvatarFallback className="text-lg">
                            {getInitials(profile.name)}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <h3 className="text-xl font-medium">{profile.name}</h3>
                      
                      {/* Display role as badge */}
                      <Badge className="mt-2 mb-3" variant="outline">
                        {profile.role === 'alumni' ? 'Alumni/Mentor' : 'Applicant'}
                      </Badge>
                      
                      {/* Only show these fields if they exist */}
                      {profile.school && profile.school.name && (
                        <p className="text-sm text-gray-600 mb-1">{profile.school.name}</p>
                      )}
                      
                      {profile.major && profile.major.name && (
                        <p className="text-sm text-gray-500 mb-3">{profile.major.name}</p>
                      )}
                      
                      {profile.bio && (
                        <p className="text-sm mb-4 line-clamp-3">{profile.bio}</p>
                      )}
                      
                      <Button 
                        onClick={() => navigate(`/profile/${profile.id}`)} 
                        variant="outline"
                        className="w-full"
                      >
                        View Profile
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Browse;
