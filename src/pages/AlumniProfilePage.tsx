
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ProfileWithDetails } from '@/types/database';
import { getProfileById } from '@/services/profiles';
import { useAuth } from '@/components/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BookingOptions from '@/components/BookingOptions';
import MentorInfo from '@/components/MentorInfo';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit } from 'lucide-react';

const AlumniProfilePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [profile, setProfile] = useState<ProfileWithDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOwnProfile, setIsOwnProfile] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!id) {
        setError('Profile ID not provided');
        setLoading(false);
        return;
      }

      try {
        const profileData = await getProfileById(id);
        if (!profileData) {
          setError('Profile not found');
          setLoading(false);
          return;
        }

        setProfile(profileData);
        
        // Check if this is the user's own profile
        if (user && profileData.user_id === user.id) {
          setIsOwnProfile(true);
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id, user]);

  const handleEditProfile = () => {
    if (!user || !profile) return;
    
    // Navigate to appropriate dashboard based on user role
    switch (profile.role) {
      case 'mentor':
        navigate('/mentor-dashboard');
        break;
      case 'alumni':
        navigate('/alumni-dashboard');
        break;
      case 'applicant':
        navigate('/applicant-dashboard');
        break;
      default:
        navigate('/student-dashboard');
        break;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-navy mx-auto mb-4"></div>
            <p className="text-gray-600 font-sans">Loading profile...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-serif font-bold text-navy mb-4">Profile Not Found</h1>
            <p className="text-gray-600 mb-6 font-sans">{error || 'The profile you are looking for does not exist.'}</p>
            <Button onClick={() => navigate('/browse')} className="bg-navy text-white">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Browse
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const hasBookingOptions = profile.price_15_min || profile.price_30_min || profile.price_60_min;

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Header */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm border p-8">
              <div className="flex flex-col md:flex-row items-start gap-6">
                <div className="flex-shrink-0">
                  <img
                    src={profile.image || '/placeholder.svg'}
                    alt={`${profile.name}'s profile`}
                    className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                  />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h1 className="text-3xl font-serif font-bold text-navy mb-2">{profile.name}</h1>
                      {profile.headline && (
                        <p className="text-xl text-gray-700 mb-2 font-sans">{profile.headline}</p>
                      )}
                      <p className="text-lg text-gray-600 mb-4 font-sans">
                        {profile.school?.name}
                        {profile.graduation_year && ` • Class of ${profile.graduation_year}`}
                      </p>
                    </div>
                    
                    {isOwnProfile && (
                      <Button
                        onClick={handleEditProfile}
                        variant="outline"
                        className="flex items-center gap-2"
                      >
                        <Edit className="h-4 w-4" />
                        Edit Profile
                      </Button>
                    )}
                  </div>
                  
                  {profile.bio && (
                    <div className="mb-4">
                      <h3 className="text-lg font-serif font-bold text-navy mb-2">About</h3>
                      <p className="text-gray-700 leading-relaxed font-sans">{profile.bio}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-2xl font-serif font-bold text-navy mb-6">Profile Details</h2>
              <MentorInfo profile={profile} />
            </div>
          </div>

          {/* Booking Options */}
          <div className="lg:col-span-1">
            {hasBookingOptions && !isOwnProfile && (
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h2 className="text-2xl font-serif font-bold text-navy mb-6">Book a Session</h2>
                <BookingOptions 
                  profileId={profile.id} 
                  price15Min={profile.price_15_min}
                  price30Min={profile.price_30_min}
                  price60Min={profile.price_60_min}
                />
              </div>
            )}
            
            {!hasBookingOptions && (
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h3 className="text-lg font-serif font-bold text-navy mb-2">Contact</h3>
                <p className="text-gray-600 font-sans">
                  This mentor hasn't set up booking options yet. Check back later!
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AlumniProfilePage;
