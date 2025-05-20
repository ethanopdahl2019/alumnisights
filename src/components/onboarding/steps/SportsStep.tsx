
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { OnboardingStepProps, Sport } from '@/types/onboarding';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { getSports } from '@/services/activities';

const SportsStep = ({ onNext, onBack, initialData }: OnboardingStepProps) => {
  const [sports, setSports] = useState<Sport[]>([]);
  const [selectedSports, setSelectedSports] = useState<string[]>(initialData?.sports || []);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    const fetchSports = async () => {
      setIsLoading(true);
      try {
        const sportsData = await getSports();
        setSports(sportsData);
      } catch (error) {
        console.error("Error fetching sports:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSports();
  }, []);
  
  const handleSportToggle = (sportId: string) => {
    setSelectedSports(prev => {
      if (prev.includes(sportId)) {
        return prev.filter(id => id !== sportId);
      } else {
        return [...prev, sportId];
      }
    });
  };
  
  const filteredSports = searchTerm 
    ? sports.filter(sport => sport.name.toLowerCase().includes(searchTerm.toLowerCase()))
    : sports;
  
  const handleNext = () => {
    onNext({ sports: selectedSports });
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Sports & Athletics</h3>
        <p className="text-gray-600 mb-4">
          Select any sports or athletic activities you participate in (optional).
        </p>
        
        <div className="mb-4">
          <Input
            placeholder="Search sports..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-4"
          />
          
          {isLoading ? (
            <div className="py-4 text-center">Loading sports...</div>
          ) : (
            <div className="max-h-[300px] overflow-y-auto border rounded-md p-4">
              {filteredSports.length > 0 ? (
                <div className="grid grid-cols-2 gap-3">
                  {filteredSports.map((sport) => (
                    <div key={sport.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`sport-${sport.id}`}
                        checked={selectedSports.includes(sport.id)}
                        onCheckedChange={() => handleSportToggle(sport.id)}
                      />
                      <Label htmlFor={`sport-${sport.id}`} className="text-sm">{sport.name}</Label>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-4 text-center text-gray-500">No sports found</div>
              )}
            </div>
          )}
        </div>
      </div>
      
      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={handleNext}>
          Next
        </Button>
      </div>
    </div>
  );
};

export default SportsStep;
