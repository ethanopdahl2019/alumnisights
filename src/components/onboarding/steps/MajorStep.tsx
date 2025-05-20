
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { OnboardingStepProps, Major } from '@/types/onboarding';
import { getMajors } from '@/services/profiles';
import SearchInput from '@/components/SearchInput';

const MajorStep = ({ onNext, onBack, initialData }: OnboardingStepProps) => {
  const [majors, setMajors] = useState<Major[]>([]);
  const [selectedMajor, setSelectedMajor] = useState<string | null>(initialData?.majorId || null);
  const [searchValue, setSearchValue] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchMajors = async () => {
      setIsLoading(true);
      try {
        const majorsData = await getMajors();
        setMajors(majorsData);
        
        // If we have initial data, find the major name for the search input
        if (initialData?.majorId) {
          const major = majorsData.find(m => m.id === initialData.majorId);
          if (major) {
            setSearchValue(major.name);
          }
        }
      } catch (error) {
        console.error("Error fetching majors:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMajors();
  }, [initialData]);
  
  const handleSelectMajor = (major: Major) => {
    setSelectedMajor(major.id);
    setSearchValue(major.name);
  };
  
  const handleNext = () => {
    if (selectedMajor) {
      onNext({ majorId: selectedMajor });
    }
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">What's Your Major?</h3>
        <p className="text-gray-600 mb-4">
          Select your primary field of study.
        </p>
        
        <div className="mb-6">
          <SearchInput
            value={searchValue}
            onChange={setSearchValue}
            placeholder="Search for your major..."
            options={majors}
            onOptionSelect={handleSelectMajor}
            isLoading={isLoading}
          />
        </div>
      </div>
      
      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={handleNext} disabled={!selectedMajor}>
          Next
        </Button>
      </div>
    </div>
  );
};

export default MajorStep;
