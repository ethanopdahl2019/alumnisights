
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { OnboardingStepProps, School } from '@/types/onboarding';
import { getSchools } from '@/services/profiles';
import SearchInput from '@/components/SearchInput';

const SchoolStep = ({ onNext, initialData }: OnboardingStepProps) => {
  const [schools, setSchools] = useState<School[]>([]);
  const [selectedSchool, setSelectedSchool] = useState<string | null>(initialData?.schoolId || null);
  const [searchValue, setSearchValue] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchSchools = async () => {
      setIsLoading(true);
      try {
        const schoolsData = await getSchools();
        setSchools(schoolsData);
        
        // If we have initial data, find the school name for the search input
        if (initialData?.schoolId) {
          const school = schoolsData.find(s => s.id === initialData.schoolId);
          if (school) {
            setSearchValue(school.name);
          }
        }
      } catch (error) {
        console.error("Error fetching schools:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSchools();
  }, [initialData]);
  
  const handleSelectSchool = (school: School) => {
    setSelectedSchool(school.id);
    setSearchValue(school.name);
  };
  
  const handleNext = () => {
    if (selectedSchool) {
      onNext({ schoolId: selectedSchool });
    }
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Select Your School</h3>
        <p className="text-gray-600 mb-4">
          Choose the university or college you attended or are currently attending.
        </p>
        
        <div className="mb-6">
          <SearchInput
            value={searchValue}
            onChange={setSearchValue}
            placeholder="Search for your school..."
            options={schools}
            onOptionSelect={handleSelectSchool}
            isLoading={isLoading}
          />
        </div>
      </div>
      
      <div className="flex justify-end">
        <Button 
          onClick={handleNext} 
          disabled={!selectedSchool}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default SchoolStep;
