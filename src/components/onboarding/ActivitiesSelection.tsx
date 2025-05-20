
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/integrations/supabase/client';

interface ActivitiesSelectionProps {
  profileData: {
    sports: string[];
    clubs: string[];
    greekLife: string[];
  };
  updateProfileData: (data: Partial<ActivitiesSelectionProps['profileData']>) => void;
  onNext: () => void;
  onBack: () => void;
}

interface ActivityOption {
  id: string;
  name: string;
}

const ActivitiesSelection: React.FC<ActivitiesSelectionProps> = ({
  profileData,
  updateProfileData,
  onNext,
  onBack,
}) => {
  const [sports, setSports] = useState<ActivityOption[]>([]);
  const [clubs, setClubs] = useState<ActivityOption[]>([]);
  const [greekLife, setGreekLife] = useState<ActivityOption[]>([]);
  
  // Fetch activities data
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        // Fetch sports
        const { data: sportsData, error: sportsError } = await supabase
          .from('sports')
          .select('id, name')
          .order('name');
        
        if (sportsError) throw sportsError;
        setSports(sportsData || []);
        
        // Fetch clubs
        const { data: clubsData, error: clubsError } = await supabase
          .from('clubs')
          .select('id, name')
          .order('name');
        
        if (clubsError) throw clubsError;
        setClubs(clubsData || []);
        
        // Fetch Greek life
        const { data: greekData, error: greekError } = await supabase
          .from('greek_life')
          .select('id, name')
          .order('name');
        
        if (greekError) throw greekError;
        setGreekLife(greekData || []);
      } catch (error) {
        console.error('Error fetching activities:', error);
      }
    };
    
    fetchActivities();
  }, []);
  
  // Handle sports selection
  const handleSportToggle = (sportId: string) => {
    const updatedSports = profileData.sports.includes(sportId)
      ? profileData.sports.filter(id => id !== sportId)
      : [...profileData.sports, sportId];
    
    updateProfileData({ sports: updatedSports });
  };
  
  // Handle clubs selection
  const handleClubToggle = (clubId: string) => {
    const updatedClubs = profileData.clubs.includes(clubId)
      ? profileData.clubs.filter(id => id !== clubId)
      : [...profileData.clubs, clubId];
    
    updateProfileData({ clubs: updatedClubs });
  };
  
  // Handle Greek life selection
  const handleGreekLifeToggle = (greekLifeId: string) => {
    const updatedGreekLife = profileData.greekLife.includes(greekLifeId)
      ? profileData.greekLife.filter(id => id !== greekLifeId)
      : [...profileData.greekLife, greekLifeId];
    
    updateProfileData({ greekLife: updatedGreekLife });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  // Render activity options with checkboxes
  const renderOptions = (
    options: ActivityOption[], 
    selected: string[], 
    onToggle: (id: string) => void
  ) => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
        {options.map(option => (
          <div key={option.id} className="flex items-center space-x-2">
            <Checkbox 
              id={option.id} 
              checked={selected.includes(option.id)}
              onCheckedChange={() => onToggle(option.id)}
            />
            <Label htmlFor={option.id} className="cursor-pointer">{option.name}</Label>
          </div>
        ))}
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium">Sports</h3>
          <p className="text-gray-500 text-sm mb-2">Select any sports you participated in</p>
          {renderOptions(sports, profileData.sports, handleSportToggle)}
        </div>
        
        <div>
          <h3 className="text-lg font-medium">Clubs & Organizations</h3>
          <p className="text-gray-500 text-sm mb-2">Select any clubs or organizations you were a member of</p>
          {renderOptions(clubs, profileData.clubs, handleClubToggle)}
        </div>
        
        <div>
          <h3 className="text-lg font-medium">Greek Life</h3>
          <p className="text-gray-500 text-sm mb-2">Select any Greek organizations you were a member of</p>
          {renderOptions(greekLife, profileData.greekLife, handleGreekLifeToggle)}
        </div>
      </div>
      
      <div className="pt-4 flex justify-between">
        <Button type="button" variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button type="submit">
          Next
        </Button>
      </div>
    </form>
  );
};

export default ActivitiesSelection;
