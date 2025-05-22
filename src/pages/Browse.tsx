
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProfileCard from '@/components/ProfileCard';
import ProfileFilter from '@/components/ProfileFilter';
import SearchInput from '@/components/SearchInput';
import type { School, Major, Activity, ProfileWithDetails } from '@/types/database';
import { getAllProfiles, getSchools, getMajors, getActivities } from '@/services/profiles';
import { fetchAllUsers } from '@/services/supabase/users';
import { toast } from 'sonner';
import { User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

// Fallback user profile with minimal data
interface FallbackProfile {
  id: string;
  name: string;
  image: string | null;
  isFallback: boolean;
}

const Browse = () => {
  const [loading, setLoading] = useState(true);
  const [profiles, setProfiles] = useState<(ProfileWithDetails | FallbackProfile)[]>([]);
  const [schools, setSchools] = useState<School[]>([]);
  const [majors, setMajors] = useState<Major[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const loadData = async () => {
      try {
        // Start by trying to load the standard way with getAllProfiles
        try {
          const [profilesData, schoolsData, majorsData, activitiesData] = await Promise.all([
            getAllProfiles(),
            getSchools(),
            getMajors(),
            getActivities()
          ]);
          
          console.log("[Browse] Loaded profiles:", profilesData.length);
          setProfiles(profilesData);
          setSchools(schoolsData);
          setMajors(majorsData);
          setActivities(activitiesData);
        } catch (profileError) {
          console.error('Error loading profiles with standard method:', profileError);
          
          // Fallback to user management approach
          try {
            // Get all schools, majors and activities still
            const [schoolsData, majorsData, activitiesData] = await Promise.all([
              getSchools(),
              getMajors(),
              getActivities()
            ]);
            
            setSchools(schoolsData);
            setMajors(majorsData);
            setActivities(activitiesData);
            
            // Get all users from admin-users edge function
            const allUsers = await fetchAllUsers();
            console.log("[Browse] Loaded users from admin API:", allUsers.length);
            
            // Map users to minimal profiles
            const fallbackProfiles: FallbackProfile[] = allUsers.map(user => ({
              id: user.profile?.id || user.id,
              name: user.profile?.name || 
                    `${user.user_metadata?.first_name || ''} ${user.user_metadata?.last_name || ''}`.trim() || 
                    user.email?.split('@')[0] || 
                    'Anonymous User',
              image: user.profile?.image || null,
              isFallback: true
            }));
            
            setProfiles(fallbackProfiles);
          } catch (fallbackError) {
            console.error('Error with fallback method:', fallbackError);
            throw fallbackError; // Re-throw to be caught by outer catch
          }
        }
      } catch (error) {
        console.error('Error loading browse data:', error);
        setError('Failed to load profiles. Displaying limited information.');
        toast.error("There was an error loading complete profile data.");
        
        // Create empty profiles array if all methods failed
        setProfiles([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleFilterChange = (categoryId: string, selectedIds: string[]) => {
    setActiveFilters((prev) => ({
      ...prev,
      [categoryId]: selectedIds
    }));
  };

  const filterCategories = [
    {
      id: 'schools',
      name: 'Schools',
      options: schools.map(school => ({
        id: school.id,
        label: school.name
      }))
    },
    {
      id: 'majors',
      name: 'Majors',
      options: majors.map(major => ({
        id: major.id,
        label: major.name
      }))
    },
    {
      id: 'activities',
      name: 'Activities & Interests',
      options: activities.map(activity => ({
        id: activity.id,
        label: activity.name
      }))
    }
  ];

  // Handle both full profiles and fallback profiles
  const filteredProfiles = profiles.filter((profile) => {
    // Skip filtering if it's a fallback profile
    if ('isFallback' in profile) {
      return searchTerm 
        ? profile.name.toLowerCase().includes(searchTerm.toLowerCase())
        : true;
    }
    
    // For regular profiles, apply full filtering
    const regularProfile = profile as ProfileWithDetails;
    
    // Include all alumni profiles with role='alumni'
    if (!regularProfile || regularProfile.role !== 'alumni') return false;
    
    const matchesSearch = regularProfile.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      regularProfile.school?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      regularProfile.major?.name?.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (Object.values(activeFilters).every((filters) => filters.length === 0)) {
      return true;
    }

    return Object.entries(activeFilters).every(([categoryId, selectedIds]) => {
      if (selectedIds.length === 0) return true;

      switch (categoryId) {
        case 'schools':
          return selectedIds.includes(regularProfile.school_id);
        case 'majors':
          return selectedIds.includes(regularProfile.major_id);
        case 'activities':
          return regularProfile.activities?.some(activity => 
            selectedIds.includes(activity.id)
          );
        default:
          return true;
      }
    });
  });

  // Special simple card for fallback profiles
  const FallbackProfileCard = ({ profile }: { profile: FallbackProfile }) => (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <Card className="bg-white rounded-xl overflow-hidden flex flex-col items-center p-6 transition duration-300 hover:shadow-md">
        <div className="flex justify-center w-full mb-4">
          <Avatar className="w-28 h-28">
            {profile.image ? (
              <AvatarImage src={profile.image} alt={`${profile.name}'s profile`} className="object-cover" />
            ) : (
              <AvatarFallback className="bg-primary/10 flex items-center justify-center">
                <User className="h-12 w-12 text-primary/60" />
              </AvatarFallback>
            )}
          </Avatar>
        </div>
        <div className="flex flex-col items-center flex-grow w-full">
          <h3 className="font-medium text-lg text-center">{profile.name}</h3>
          <p className="text-sm text-gray-500 mt-2">Profile information unavailable</p>
        </div>
      </Card>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <main className="py-12">
          <div className="container-custom">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
              <div className="grid md:grid-cols-4 gap-8">
                <div className="h-[400px] bg-gray-200 rounded"></div>
                <div className="md:col-span-3 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-[300px] bg-gray-200 rounded"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="py-12">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <h1 className="text-3xl md:text-4xl font-medium mb-6">Browse Profiles</h1>
            <SearchInput
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Search by name, school, or major..."
              className="max-w-2xl"
            />
            
            {error && (
              <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-md text-amber-800">
                <p>{error}</p>
              </div>
            )}
          </motion.div>
          
          <div className="flex flex-col md:flex-row gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="md:w-1/4"
            >
              <ProfileFilter 
                categories={filterCategories}
                onFilterChange={handleFilterChange}
              />
            </motion.div>
            
            <div className="md:w-3/4">
              {filteredProfiles.length > 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {filteredProfiles.map((profile) => (
                    'isFallback' in profile ? (
                      <FallbackProfileCard key={profile.id} profile={profile} />
                    ) : (
                      <ProfileCard
                        key={profile.id}
                        profile={profile as ProfileWithDetails}
                      />
                    )
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="text-center py-12"
                >
                  <h3 className="text-xl font-medium mb-2">No matching profiles</h3>
                  <p className="text-gray-600 mb-6">
                    Try adjusting your search or filters to find more profiles
                  </p>
                  <Button 
                    className="btn-secondary"
                    onClick={() => {
                      setActiveFilters({});
                      setSearchTerm('');
                    }}
                  >
                    Clear All Filters
                  </Button>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Browse;
