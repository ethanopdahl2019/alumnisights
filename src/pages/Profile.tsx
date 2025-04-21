
import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/components/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Tag from '@/components/Tag';
import { getProfileById } from '@/services/profiles';
import { ProfileWithDetails } from '@/types/database';

type ProductType = "15_min" | "30_min" | "60_min";

const getProductDetails = (profile: ProfileWithDetails | null) => profile ? [
  {
    type: "15_min" as ProductType,
    title: "15 Minute Chat",
    description: "A quick introduction call",
    price: profile.price_15_min ?? null,
  },
  {
    type: "30_min" as ProductType,
    title: "30 Minute Consultation",
    description: "In-depth discussion about your questions",
    price: profile.price_30_min ?? null,
  },
  {
    type: "60_min" as ProductType,
    title: "1 Hour Mentoring",
    description: "Comprehensive guidance and advice",
    price: profile.price_60_min ?? null,
  },
] : [];

const ProfilePage = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<ProfileWithDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedProfiles, setRelatedProfiles] = useState<ProfileWithDetails[]>([]);
  const [isOwnProfile, setIsOwnProfile] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!id) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const profileData = await getProfileById(id);
        setProfile(profileData);

        if (user && profileData) {
          const { data: userProfile } = await supabase
            .from('profiles')
            .select('id')
            .eq('user_id', user.id)
            .single();

          if (userProfile && userProfile.id === profileData.id) {
            setIsOwnProfile(true);
          }
        }

        if (profileData) {
          const { data } = await supabase
            .from('profiles')
            .select(`
              *,
              school:schools(id, name, location, type, image, created_at),
              major:majors(*),
              activities:profile_activities(activities(*))
            `)
            .neq('id', id)
            .or(`school_id.eq.${profileData.school_id},major_id.eq.${profileData.major_id}`)
            .limit(2);

          if (data) {
            setRelatedProfiles(data.map(profile => ({
              ...profile,
              school: {
                ...profile.school,
                image: profile.school?.image ?? null
              },
              activities: profile.activities.map((pa: any) => pa.activities)
            })));
          }
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id, user]);

  // ---- Handle Payment ---- //
  const handlePurchase = async (productType: ProductType) => {
    if (!user) {
      navigate('/auth'); // If not logged in, redirect to login
      return;
    }
    // Start/create conversation row as 'pending'
    if (!profile) return;
    // Find/check if conversation already exists (pending or paid) for this applicant/alumni/product
    const { data: existing } = await supabase
      .from('conversations')
      .select('*')
      .eq('applicant_id', user.id)
      .eq('alumni_id', profile.user_id)
      .eq('product_type', productType)
      .maybeSingle();

    let convId: string | null = null;
    if (existing) {
      convId = existing.id;
    } else {
      const { data: conv } = await supabase
        .from('conversations')
        .insert({
          applicant_id: user.id,
          alumni_id: profile.user_id,
          product_type: productType,
          payment_status: 'pending'
        })
        .select()
        .single();
      convId = conv?.id;
    }

    // Call payment edge function (simulate w/ alert for now)
    // TODO: Replace this with a call to `/functions/create-payment`
    // and redirect to checkout
    alert("Pretend we sent you to Stripe Checkout for: " + productType + ". After payment, you will be redirected to the messaging system.");
    // After payment (simulate instantly for now)
    // Mark payment as paid:
    await supabase
      .from("conversations")
      .update({ payment_status: "paid" })
      .eq("id", convId);
    navigate(`/messages/${convId}`);
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
            The profile you're looking for doesn't exist or has been removed.
          </p>
          <Link to="/browse" className="btn-primary">
            Browse Profiles
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {isOwnProfile && (
        <div className="bg-navy text-white py-3">
          <div className="container-custom text-center">
            <p className="text-sm mb-2">This is your public profile</p>
            <button 
              onClick={() => navigate('/alumni-dashboard')} 
              className="px-4 py-1 bg-white text-navy rounded-md text-sm hover:bg-gray-100 transition-colors"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      )}

      <main className="py-12">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row gap-12">
            <div className="md:w-1/3">
              <div className="sticky top-24">
                <div className="aspect-[3/4] overflow-hidden rounded-xl mb-6">
                  <img 
                    src={profile.image || '/placeholder.svg'} 
                    alt={`${profile.name}'s profile`} 
                    className="w-full h-full object-cover" 
                  />
                </div>
                
                <h1 className="text-2xl md:text-3xl font-medium mb-1">{profile.name}</h1>
                <p className="text-gray-600 mb-4">{profile.school?.name}</p>
                
                <div className="mb-6">
                  {profile.major && (
                    <Tag type="major">{profile.major.name}</Tag>
                  )}
                </div>
                
                <div className="flex flex-wrap gap-2 mb-8">
                  {profile.activities?.map((activity) => (
                    <Tag key={activity.id} type={activity.type as "club" | "sport" | "study"}>
                      {activity.name}
                    </Tag>
                  ))}
                </div>
                
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-medium mb-4">Quick Links</h3>
                  <ul className="space-y-2">
                    <li>
                      <button 
                        className="text-navy hover:underline focus:outline-none"
                        onClick={() => {
                          const bookingSection = document.getElementById('booking-section');
                          if (bookingSection) {
                            bookingSection.scrollIntoView({ behavior: 'smooth' });
                          }
                        }}
                      >
                        Book a Conversation
                      </button>
                    </li>
                    <li>
                      <Link 
                        to={`/schools/${profile.school?.id || ''}`} 
                        className="text-navy hover:underline"
                      >
                        More from {profile.school?.name}
                      </Link>
                    </li>
                    <li>
                      <Link 
                        to={`/browse?major=${profile.major?.id || ''}`} 
                        className="text-navy hover:underline"
                      >
                        Similar {profile.major?.name} Profiles
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="md:w-2/3">
              <div className="mb-12">
                <h2 className="text-2xl md:text-3xl font-medium mb-6">About</h2>
                <div className="prose prose-lg max-w-none">
                  <p>{profile.bio || 'No bio available.'}</p>
                </div>
              </div>
              
              <div id="booking-section">
                <div className="mb-8">
                  <h4 className="text-lg font-semibold mb-4">Book a Conversation</h4>
                  <div className="grid gap-4">
                    {getProductDetails(profile).map((prod) =>
                      prod.price ? (
                        <div key={prod.type} className="flex flex-col md:flex-row md:items-center justify-between border border-gray-100 bg-gray-50 rounded-xl p-4">
                          <div>
                            <div className="font-medium text-base">{prod.title}</div>
                            <div className="text-gray-600">{prod.description}</div>
                          </div>
                          <div className="flex items-center mt-2 md:mt-0 gap-4">
                            <div className="text-lg font-bold text-navy">${prod.price}</div>
                            <button
                              className="bg-navy text-white px-4 py-2 rounded hover:bg-navy/90 transition-colors"
                              onClick={() => handlePurchase(prod.type)}
                              disabled={isOwnProfile}
                            >
                              {user ? "Pay" : "Sign In to Pay"}
                            </button>
                          </div>
                        </div>
                      ) : null
                    )}
                  </div>
                  <div className="mt-3 text-sm text-yellow-900 bg-yellow-50 border border-yellow-200 rounded px-4 py-3">
                    Please complete your payment to unlock messaging and coordinate directly with this alumni.
                  </div>
                </div>
              </div>
              
              {relatedProfiles.length > 0 && (
                <div className="mt-16 pt-8 border-t border-gray-200">
                  <h3 className="text-xl font-medium mb-6">You might also like</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {relatedProfiles.map(relatedProfile => (
                      <Link
                        key={relatedProfile.id}
                        to={`/profile/${relatedProfile.id}`}
                        className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                      >
                        <img
                          src={relatedProfile.image || '/placeholder.svg'}
                          alt={relatedProfile.name}
                          className="w-16 h-16 rounded-full object-cover mr-4"
                        />
                        <div>
                          <h4 className="font-medium mb-1">{relatedProfile.name}</h4>
                          <p className="text-sm text-gray-600">{relatedProfile.school?.name}</p>
                          <div className="mt-1">
                            {relatedProfile.major && (
                              <Tag type="major" className="text-xs py-0.5 px-2">
                                {relatedProfile.major.name}
                              </Tag>
                            )}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProfilePage;
