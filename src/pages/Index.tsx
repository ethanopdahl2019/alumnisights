
import { useEffect, useState } from 'react';
import { getFeaturedProfiles } from '@/services/profiles';
import type { ProfileWithDetails } from '@/types/database';
import SimpleNavbar from '@/components/SimpleNavbar';
import SchoolImageCarousel from '@/components/SchoolImageCarousel';
import ProfileCard from '@/components/ProfileCard';
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
    <div className="min-h-screen bg-white flex flex-col">
      <SimpleNavbar />
      <main>
        {/* Horizontal row of school images */}
        <SchoolImageCarousel />
        {/* Featured Profiles (smaller minimalist carousel) */}
        <section className="py-12">
          <div className="container-custom">
            <h2 className="text-2xl md:text-3xl font-medium text-center mb-2">Featured Profiles</h2>
            {!loading && profiles.length === 0 && (
              <p className="text-gray-500 text-center">No featured profiles at the moment.</p>
            )}
            {loading ? (
              <div className="grid md:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-gray-200 aspect-[3/4] rounded-lg mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3 mb-1"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div
                className={`flex gap-4 justify-center overflow-x-auto hide-scrollbar px-2`}
                style={{ WebkitOverflowScrolling: 'touch' }}
              >
                {profiles.map((profile) => (
                  <div className="flex-shrink-0" key={profile.id} style={{ width: isMobile ? 180 : 200 }}>
                    <ProfileCard profile={profile} variant="mini" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;
