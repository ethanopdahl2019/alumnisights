
import { useEffect, useState } from 'react';
import { getFeaturedProfiles } from '@/services/profiles';
import type { ProfileWithDetails } from '@/types/database';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import HowItWorks from '@/components/HowItWorks';
import Carousel from '@/components/Carousel';
import ProfileCard from '@/components/ProfileCard';
import Footer from '@/components/Footer';
import { useIsMobile } from '@/hooks/use-mobile';

const Index = () => {
  const isMobile = useIsMobile();
  const [profiles, setProfiles] = useState<ProfileWithDetails[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfiles = async () => {
      const featuredProfiles = await getFeaturedProfiles();
      setProfiles(featuredProfiles);
      setLoading(false);
    };

    loadProfiles();
  }, []);
  
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main>
        <Hero />
        
        <section className="py-20">
          <div className="container-custom">
            <h2 className="text-3xl md:text-4xl font-medium text-center mb-4">Featured Profiles</h2>
            <p className="text-gray-600 text-center max-w-3xl mx-auto mb-12">
              Connect with current students and alumni from top schools across the country
            </p>
            
            {loading ? (
              <div className="grid md:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-gray-200 aspect-[3/4] rounded-lg mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : (
              <Carousel slidesToShow={isMobile ? 1 : Math.min(3, profiles.length)}>
                {profiles.map(profile => (
                  <ProfileCard 
                    key={profile.id}
                    id={profile.id}
                    name={profile.name}
                    image={profile.image || '/placeholder.svg'}
                    school={profile.school.name}
                    major={profile.major.name}
                    tags={profile.activities.map(activity => ({
                      id: activity.id,
                      label: activity.name,
                      type: activity.type
                    }))}
                  />
                ))}
              </Carousel>
            )}
            
            <div className="mt-12 text-center">
              <a href="/browse" className="btn-secondary">
                View All Profiles
              </a>
            </div>
          </div>
        </section>
        
        <HowItWorks />
        
        <section className="py-20 bg-gray-50">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-medium text-center mb-12">
                Get the insights that college websites don't tell you
              </h2>
              
              <div className="grid md:grid-cols-3 gap-8 text-center">
                <div>
                  <div className="h-16 w-16 bg-tag-major rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-tag-major-text" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 20h9"></path>
                      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                    </svg>
                  </div>
                  <h3 className="text-xl font-medium mb-2">Authentic Perspectives</h3>
                  <p className="text-gray-600">
                    Hear real stories, not marketing materials
                  </p>
                </div>
                
                <div>
                  <div className="h-16 w-16 bg-tag-sport rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-tag-sport-text" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                      <path d="M2 12h20"></path>
                    </svg>
                  </div>
                  <h3 className="text-xl font-medium mb-2">Global Network</h3>
                  <p className="text-gray-600">
                    Connect with students from schools worldwide
                  </p>
                </div>
                
                <div>
                  <div className="h-16 w-16 bg-tag-club rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-tag-club-text" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                      <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                    </svg>
                  </div>
                  <h3 className="text-xl font-medium mb-2">Tailored Insights</h3>
                  <p className="text-gray-600">
                    Find answers to your specific questions
                  </p>
                </div>
              </div>
              
              <div className="mt-12 text-center">
                <a href="/sign-up" className="btn-primary">
                  Start Your Journey
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
