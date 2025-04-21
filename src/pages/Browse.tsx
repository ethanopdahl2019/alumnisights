
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { School, Major, Activity, ProfileWithDetails } from '@/types/database';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProfileCard from '@/components/ProfileCard';
import ProfileFilter from '@/components/ProfileFilter';

const Browse = () => {
  const [loading, setLoading] = useState(true);
  const [profiles, setProfiles] = useState<ProfileWithDetails[]>([]);
  const [schools, setSchools] = useState<School[]>([]);
  const [majors, setMajors] = useState<Major[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});
  
  useEffect(() => {
    const loadData = async () => {
      const [profilesResp, schoolsResp, majorsResp, activitiesResp] = await Promise.all([
        supabase
          .from('profiles')
          .select(`
            *,
            school:schools(id, name, location, type, image, created_at),
            major:majors(*),
            activities:profile_activities(activities(*))
          `),
        supabase.from('schools').select('id, name, location, type, image, created_at'),
        supabase.from('majors').select('*'),
        supabase.from('activities').select('*')
      ]);
      
      if (profilesResp.error || !Array.isArray(profilesResp.data)) {
        setProfiles([]);
        console.error('Error loading profiles:', profilesResp.error);
      } else {
        setProfiles(
          profilesResp.data.map(profile => ({
            ...profile,
            school: {
              ...(profile.school ?? {}),
              image: profile.school?.image ?? null
            },
            activities: profile.activities.map((pa: any) => pa.activities)
          }))
        );
      }

      if (schoolsResp.error || !Array.isArray(schoolsResp.data)) {
        setSchools([]);
        console.error('Error loading schools:', schoolsResp.error);
      } else {
        setSchools(
          schoolsResp.data.map((school: any) => ({
            ...school,
            image: school.image ?? null
          }))
        );
      }

      if (majorsResp.error || !Array.isArray(majorsResp.data)) {
        setMajors([]);
        console.error('Error loading majors:', majorsResp.error);
      } else {
        setMajors(majorsResp.data);
      }

      if (activitiesResp.error || !Array.isArray(activitiesResp.data)) {
        setActivities([]);
        console.error('Error loading activities:', activitiesResp.error);
      } else {
        setActivities(activitiesResp.data);
      }
      
      setLoading(false);
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
          return profile.activities.some(activity => 
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
          <h1 className="text-3xl md:text-4xl font-medium mb-8">Browse Profiles</h1>
          
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/4">
              <ProfileFilter 
                categories={filterCategories}
                onFilterChange={handleFilterChange}
              />
            </div>
            
            <div className="md:w-3/4">
              {filteredProfiles.length > 0 ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProfiles.map((profile) => (
                    <ProfileCard
                      key={profile.id}
                      profile={profile}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <h3 className="text-xl font-medium mb-2">No matching profiles</h3>
                  <p className="text-gray-600 mb-6">
                    Try adjusting your filters to find more profiles
                  </p>
                  <button 
                    className="btn-secondary"
                    onClick={() => setActiveFilters({})}
                  >
                    Clear All Filters
                  </button>
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

export default Browse;
