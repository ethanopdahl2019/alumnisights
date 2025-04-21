
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Tag from '@/components/Tag';
import BookingOptions from '@/components/BookingOptions';
import profiles, { Profile } from '@/data/profiles';

const ProfilePage = () => {
  const { id } = useParams<{ id: string }>();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Simulate fetching profile data
    const foundProfile = profiles.find((p) => p.id === id);
    setProfile(foundProfile || null);
    setLoading(false);
  }, [id]);
  
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
      
      <main className="py-12">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row gap-12">
            <div className="md:w-1/3">
              <div className="sticky top-24">
                <div className="aspect-[3/4] overflow-hidden rounded-xl mb-6">
                  <img 
                    src={profile.image} 
                    alt={`${profile.name}'s profile`} 
                    className="w-full h-full object-cover" 
                  />
                </div>
                
                <h1 className="text-2xl md:text-3xl font-medium mb-1">{profile.name}</h1>
                <p className="text-gray-600 mb-4">{profile.school}</p>
                
                <div className="mb-6">
                  <Tag type="major">{profile.major}</Tag>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-8">
                  {profile.tags.map((tag) => (
                    <Tag key={tag.id} type={tag.type}>
                      {tag.label}
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
                      <Link to={`/school/${profile.school.toLowerCase().replace(/\s+/g, '-')}`} className="text-navy hover:underline">
                        More from {profile.school}
                      </Link>
                    </li>
                    <li>
                      <Link to={`/major/${profile.major.toLowerCase().replace(/\s+/g, '-')}`} className="text-navy hover:underline">
                        Similar {profile.major} Profiles
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
                  <p>{profile.bio}</p>
                </div>
              </div>
              
              <div id="booking-section">
                <BookingOptions 
                  profileId={profile.id} 
                  options={profile.bookingOptions}
                />
              </div>
              
              <div className="mt-16 pt-8 border-t border-gray-200">
                <h3 className="text-xl font-medium mb-6">You might also like</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {profiles
                    .filter(p => p.id !== profile.id)
                    .filter(p => p.school === profile.school || p.major === profile.major)
                    .slice(0, 2)
                    .map(relatedProfile => (
                      <Link
                        key={relatedProfile.id}
                        to={`/profile/${relatedProfile.id}`}
                        className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                      >
                        <img
                          src={relatedProfile.image}
                          alt={relatedProfile.name}
                          className="w-16 h-16 rounded-full object-cover mr-4"
                        />
                        <div>
                          <h4 className="font-medium mb-1">{relatedProfile.name}</h4>
                          <p className="text-sm text-gray-600">{relatedProfile.school}</p>
                          <div className="mt-1">
                            <Tag type="major" className="text-xs py-0.5 px-2">
                              {relatedProfile.major}
                            </Tag>
                          </div>
                        </div>
                      </Link>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ProfilePage;
