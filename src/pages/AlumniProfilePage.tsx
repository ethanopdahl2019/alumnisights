
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { MapPin, GraduationCap, Calendar, Star, ArrowLeft } from 'lucide-react';
import { getProfileById } from '@/services/profiles';
import { ProfileWithDetails } from '@/types/database';
import { toast } from '@/hooks/use-toast';
import ReviewCard from '@/components/ReviewCard';
import { supabase } from '@/integrations/supabase/client';

const AlumniProfilePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<ProfileWithDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<any[]>([]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!id) {
        toast({
          title: "Error",
          description: "Profile ID is missing",
          variant: "destructive"
        });
        navigate('/browse');
        return;
      }

      try {
        const profileData = await getProfileById(id);
        if (!profileData) {
          toast({
            title: "Profile not found",
            description: "The requested profile could not be found",
            variant: "destructive"
          });
          navigate('/browse');
          return;
        }
        
        setProfile(profileData);

        // Fetch reviews for this profile
        const { data: reviewsData, error: reviewsError } = await supabase
          .from('reviews')
          .select('*')
          .eq('profile_id', id)
          .order('created_at', { ascending: false });

        if (reviewsError) {
          console.error('Error fetching reviews:', reviewsError);
        } else {
          setReviews(reviewsData || []);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast({
          title: "Error loading profile",
          description: "Could not load the profile. Please try again.",
          variant: "destructive"
        });
        navigate('/browse');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id, navigate]);

  const handleBookSession = () => {
    if (!profile) return;
    
    // Navigate to booking page with the correct profile ID
    navigate(`/booking/${profile.id}`);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-start space-x-6">
                <div className="w-32 h-32 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">Profile Not Found</h1>
          <p className="text-gray-600 mb-6">The profile you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/browse')}>
            Back to Browse
          </Button>
        </div>
      </div>
    );
  }

  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/browse')} 
          className="mb-6 flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Browse
        </Button>

        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-start space-y-6 md:space-y-0 md:space-x-6">
              <Avatar className="w-32 h-32 mx-auto md:mx-0">
                <AvatarImage src={profile.image || ''} alt={profile.name} />
                <AvatarFallback className="text-2xl">
                  {profile.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl font-bold mb-2">{profile.name}</h1>
                
                {profile.headline && (
                  <p className="text-lg text-gray-600 mb-4">{profile.headline}</p>
                )}
                
                <div className="flex flex-wrap justify-center md:justify-start gap-4 mb-4">
                  {profile.school && (
                    <div className="flex items-center text-sm text-gray-600">
                      <GraduationCap className="h-4 w-4 mr-1" />
                      {profile.school.name}
                    </div>
                  )}
                  
                  {profile.graduation_year && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="h-4 w-4 mr-1" />
                      Class of {profile.graduation_year}
                    </div>
                  )}
                  
                  {profile.location && (
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="h-4 w-4 mr-1" />
                      {profile.location}
                    </div>
                  )}
                </div>

                {reviews.length > 0 && (
                  <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="ml-1 text-sm font-medium">
                        {averageRating.toFixed(1)}
                      </span>
                    </div>
                    <span className="text-sm text-gray-600">
                      ({reviews.length} review{reviews.length !== 1 ? 's' : ''})
                    </span>
                  </div>
                )}

                {profile.major && (
                  <Badge variant="secondary" className="mb-4">
                    {profile.major.name}
                  </Badge>
                )}
              </div>
              
              <div className="flex flex-col space-y-2 w-full md:w-auto">
                {(profile.price_15_min || profile.price_30_min || profile.price_60_min) && (
                  <Button onClick={handleBookSession} size="lg" className="w-full md:w-auto">
                    Book a Session
                  </Button>
                )}
              </div>
            </div>
            
            {profile.bio && (
              <div className="mt-6 pt-6 border-t">
                <h3 className="text-lg font-semibold mb-2">About</h3>
                <p className="text-gray-700 leading-relaxed">{profile.bio}</p>
              </div>
            )}

            {profile.achievements && profile.achievements.length > 0 && (
              <div className="mt-6 pt-6 border-t">
                <h3 className="text-lg font-semibold mb-3">Experience & Achievements</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {profile.achievements.map((achievement, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-sm text-gray-700">{achievement}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {reviews.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Reviews</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reviews.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AlumniProfilePage;
