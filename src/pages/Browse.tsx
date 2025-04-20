
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProfileCard from '@/components/ProfileCard';
import ProfileFilter from '@/components/ProfileFilter';
import profiles from '@/data/profiles';
import filterCategories from '@/data/filters';

const Browse = () => {
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});
  
  const handleFilterChange = (categoryId: string, selectedIds: string[]) => {
    setActiveFilters((prev) => ({
      ...prev,
      [categoryId]: selectedIds
    }));
  };
  
  // Simple filtering logic for demonstration
  const filteredProfiles = profiles.filter((profile) => {
    // If no filters are active, show all profiles
    if (Object.values(activeFilters).every((filters) => filters.length === 0)) {
      return true;
    }
    
    // Check if profile matches at least one filter in each active category
    return Object.entries(activeFilters).every(([categoryId, selectedFilters]) => {
      // If no filters selected in this category, it's not an active filter
      if (selectedFilters.length === 0) {
        return true;
      }
      
      // Simple matching logic (would be more sophisticated in a real app)
      if (categoryId === 'schools') {
        return selectedFilters.some((filter) => 
          profile.school.toLowerCase().includes(filter.replace('-', ' '))
        );
      }
      
      if (categoryId === 'majors') {
        return selectedFilters.some((filter) => 
          profile.major.toLowerCase().includes(filter.replace('-', ' '))
        );
      }
      
      if (categoryId === 'activities' || categoryId === 'sports') {
        return profile.tags.some((tag) => 
          selectedFilters.some((filter) => 
            tag.label.toLowerCase().includes(filter.replace('-', ' '))
          )
        );
      }
      
      return true;
    });
  });

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
                      id={profile.id}
                      name={profile.name}
                      image={profile.image}
                      school={profile.school}
                      major={profile.major}
                      tags={profile.tags}
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
