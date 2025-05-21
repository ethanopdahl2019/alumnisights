
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProfileCard from '@/components/ProfileCard';
import ProfileFilter from '@/components/ProfileFilter';
import SearchInput from '@/components/SearchInput';
import type { School, Major, Activity, ProfileWithDetails } from '@/types/database';
import { getAllProfiles, getSchools, getMajors, getActivities } from '@/services/profiles';

const Browse = () => {
  const [loading, setLoading] = useState(true);
  const [profiles, setProfiles] = useState<ProfileWithDetails[]>([]);
  const [schools, setSchools] = useState<School[]>([]);
  const [majors, setMajors] = useState<Major[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    const loadData = async () => {
      try {
        // Use the service functions to fetch data
        const [profilesData, schoolsData, majorsData, activitiesData] = await Promise.all([
          getAllProfiles(),
          getSchools(),
          getMajors(),
          getActivities()
        ]);
        
        setProfiles(profilesData);
        setSchools(schoolsData);
        setMajors(majorsData);
        setActivities(activitiesData);
      } catch (error) {
        console.error('Error loading browse data:', error);
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

  const filteredProfiles = profiles.filter((profile) => {
    // Include alumni profiles (mentors) - role check is handled in getAllProfiles now
    
    const matchesSearch = profile.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.school?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.major?.name?.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (Object.values(activeFilters).every((filters) => filters.length === 0)) {
      return true;
    }

    return Object.entries(activeFilters).every(([categoryId, selectedIds]) => {
      if (selectedIds.length === 0) return true;

      switch (categoryId) {
        case 'schools':
          return selectedIds.includes(profile.school_id);
        case 'majors':
          return selectedIds.includes(profile.major_id);
        case 'activities':
          return profile.activities?.some(activity => 
            selectedIds.includes(activity.id)
          );
        default:
          return true;
      }
    });
  });

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
                    <ProfileCard
                      key={profile.id}
                      profile={profile}
                    />
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
                  <button 
                    className="btn-secondary"
                    onClick={() => {
                      setActiveFilters({});
                      setSearchTerm('');
                    }}
                  >
                    Clear All Filters
                  </button>
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
