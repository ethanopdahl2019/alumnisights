
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { OnboardingStepProps, Club } from '@/types/onboarding';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { getClubs } from '@/services/activities';

const ClubsStep = ({ onNext, onBack, initialData }: OnboardingStepProps) => {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [selectedClubs, setSelectedClubs] = useState<string[]>(initialData?.clubs || []);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    const fetchClubs = async () => {
      setIsLoading(true);
      try {
        const clubsData = await getClubs();
        setClubs(clubsData);
      } catch (error) {
        console.error("Error fetching clubs:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchClubs();
  }, []);
  
  const handleClubToggle = (clubId: string) => {
    setSelectedClubs(prev => {
      if (prev.includes(clubId)) {
        return prev.filter(id => id !== clubId);
      } else {
        return [...prev, clubId];
      }
    });
  };
  
  const filteredClubs = searchTerm 
    ? clubs.filter(club => club.name.toLowerCase().includes(searchTerm.toLowerCase()))
    : clubs;
  
  const handleNext = () => {
    onNext({ clubs: selectedClubs });
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Clubs & Activities</h3>
        <p className="text-gray-600 mb-4">
          Select any clubs or extracurricular activities you're involved in (optional).
        </p>
        
        <div className="mb-4">
          <Input
            placeholder="Search clubs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-4"
          />
          
          {isLoading ? (
            <div className="py-4 text-center">Loading clubs...</div>
          ) : (
            <div className="max-h-[300px] overflow-y-auto border rounded-md p-4">
              {filteredClubs.length > 0 ? (
                <div className="grid grid-cols-2 gap-3">
                  {filteredClubs.map((club) => (
                    <div key={club.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`club-${club.id}`}
                        checked={selectedClubs.includes(club.id)}
                        onCheckedChange={() => handleClubToggle(club.id)}
                      />
                      <Label htmlFor={`club-${club.id}`} className="text-sm">{club.name}</Label>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-4 text-center text-gray-500">No clubs found</div>
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

export default ClubsStep;
