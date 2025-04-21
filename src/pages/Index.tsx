
import { useEffect, useState } from 'react';
import { getFeaturedProfiles, getSchools } from '@/services/profiles';
import type { ProfileWithDetails, School } from '@/types/database';
import Hero from '@/components/Hero';
import HowItWorks from '@/components/HowItWorks';
import Carousel from '@/components/Carousel';
import ProfileCard from '@/components/ProfileCard';
import { useIsMobile } from '@/hooks/use-mobile';

// Simple responsive (dropdown for mobile) site navbar
function SimpleHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="border-b border-gray-100 py-4 sticky top-0 z-20 bg-white">
      <div className="flex items-center justify-between container-custom">
        <a href="/" className="text-2xl font-bold text-navy">
          AlumniSights
        </a>
        <nav className="hidden md:flex gap-8 items-center">
          <a href="/browse" className="text-navy font-medium hover:underline">Browse</a>
          <a href="/schools" className="text-navy font-medium hover:underline">Schools</a>
          <a href="/blog" className="text-navy font-medium hover:underline">Insights</a>
          <a href="/sign-in" className="text-navy font-medium hover:underline">Sign In</a>
        </nav>
        <button
          className="md:hidden text-navy focus:outline-none"
          aria-label="Open menu"
          onClick={() => setMenuOpen(o => !o)}
        >
          <svg width="28" height="28" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M4 8h16M4 16h16"/></svg>
        </button>
      </div>
      {menuOpen && (
        <div className="md:hidden bg-white absolute right-0 left-0 mt-2 shadow rounded z-30 animate-fade-in px-6 py-2">
          <a href="/browse" className="block py-2 text-navy font-medium" onClick={()=>setMenuOpen(false)}>Browse</a>
          <a href="/schools" className="block py-2 text-navy font-medium" onClick={()=>setMenuOpen(false)}>Schools</a>
          <a href="/blog" className="block py-2 text-navy font-medium" onClick={()=>setMenuOpen(false)}>Insights</a>
          <a href="/sign-in" className="block py-2 text-navy font-medium" onClick={()=>setMenuOpen(false)}>Sign In</a>
        </div>
      )}
    </header>
  );
}

function SchoolImageCarousel({ schools }: { schools: School[] }) {
  return (
    <div className="py-6 mb-8">
      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex items-center gap-6 animate-fade-in">
          {schools.map((school) => (
            <div
              key={school.id}
              className="flex-shrink-0 w-20 h-20 rounded-full bg-gray-100 border-2 border-white shadow-sm flex items-center justify-center overflow-hidden"
              title={school.name}
            >
              <img
                src={school.image || '/placeholder.svg'}
                alt={school.name}
                className="object-cover w-full h-full"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const Index = () => {
  const isMobile = useIsMobile();
  const [profiles, setProfiles] = useState<ProfileWithDetails[]>([]);
  const [schools, setSchools] = useState<School[]>([]);
  const [loadingProfiles, setLoadingProfiles] = useState(true);
  const [loadingSchools, setLoadingSchools] = useState(true);

  useEffect(() => {
    getFeaturedProfiles().then((data) => {
      setProfiles(data);
      setLoadingProfiles(false);
    });
    getSchools().then((data) => {
      setSchools(data);
      setLoadingSchools(false);
    });
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <SimpleHeader />
      <main>
        <Hero />

        {/* School logo/image carousel */}
        {!loadingSchools && schools.length > 0 && (
          <SchoolImageCarousel schools={schools.slice(0, isMobile ? 8 : 16)} />
        )}

        {/* Featured Profiles (simplified carousel/card) */}
        <section className="py-10">
          <div className="container-custom">
            <h2 className="text-2xl md:text-3xl font-medium text-center mb-4">
              Featured Profiles
            </h2>
            <p className="text-gray-600 text-center max-w-2xl mx-auto mb-8">
              Connect with current students and alumni from top schools across the country
            </p>

            {loadingProfiles ? (
              <div className="flex gap-4 justify-center">
                {[...Array(isMobile ? 1 : 3)].map((_, i) => (
                  <div key={i} className="w-[140px] animate-pulse">
                    <div className="bg-gray-200 aspect-square rounded-full mb-2" />
                    <div className="h-3 w-2/3 bg-gray-100 rounded mx-auto mb-1"></div>
                    <div className="h-3 w-1/2 bg-gray-100 rounded mx-auto"></div>
                  </div>
                ))}
              </div>
            ) : (
              <Carousel slidesToShow={isMobile ? 2 : 5} autoplay={false}>
                {profiles.map(profile => (
                  <ProfileCard key={profile.id} profile={profile} variant="compact" />
                ))}
              </Carousel>
            )}
          </div>
        </section>

        <HowItWorks />

        {/* Insights CTA */}
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
    </div>
  );
};

export default Index;
