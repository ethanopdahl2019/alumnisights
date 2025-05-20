
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { OnboardingStepProps } from '@/types/onboarding';
import { getSchools, getMajors } from '@/services/profiles';
import { getSports, getClubs, getGreekLife } from '@/services/activities';

const SummaryStep = ({ onNext, onBack, initialData }: OnboardingStepProps) => {
  const [schoolName, setSchoolName] = useState<string>('');
  const [majorName, setMajorName] = useState<string>('');
  const [sportsNames, setSportsNames] = useState<string[]>([]);
  const [clubsNames, setClubsNames] = useState<string[]>([]);
  const [greekLifeNames, setGreekLifeNames] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      
      try {
        // Fetch all required data
        const [schools, majors, sports, clubs, greekOrgs] = await Promise.all([
          getSchools(),
          getMajors(),
          initialData.sports?.length ? getSports() : [],
          initialData.clubs?.length ? getClubs() : [],
          initialData.greekLife?.length ? getGreekLife() : []
        ]);
        
        // Set school name
        if (initialData.schoolId) {
          const school = schools.find(s => s.id === initialData.schoolId);
          if (school) {
            setSchoolName(school.name);
          }
        }
        
        // Set major name
        if (initialData.majorId) {
          const major = majors.find(m => m.id === initialData.majorId);
          if (major) {
            setMajorName(major.name);
          }
        }
        
        // Set sports names
        if (initialData.sports?.length) {
          const sportsList = initialData.sports.map(id => {
            const sport = sports.find(s => s.id === id);
            return sport ? sport.name : '';
          }).filter(Boolean);
          setSportsNames(sportsList);
        }
        
        // Set clubs names
        if (initialData.clubs?.length) {
          const clubsList = initialData.clubs.map(id => {
            const club = clubs.find(c => c.id === id);
            return club ? club.name : '';
          }).filter(Boolean);
          setClubsNames(clubsList);
        }
        
        // Set Greek life names
        if (initialData.greekLife?.length) {
          const greekList = initialData.greekLife.map(id => {
            const org = greekOrgs.find(o => o.id === id);
            return org ? org.name : '';
          }).filter(Boolean);
          setGreekLifeNames(greekList);
        }
      } catch (error) {
        console.error("Error fetching data for summary:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [initialData]);
  
  const handleComplete = () => {
    onNext();
  };
  
  if (isLoading) {
    return <div className="py-4 text-center">Loading summary...</div>;
  }
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Profile Summary</h3>
        
        <div className="space-y-4">
          <div>
            <h4 className="font-medium">School</h4>
            <p>{schoolName || 'Not specified'}</p>
          </div>
          
          <div>
            <h4 className="font-medium">Major</h4>
            <p>{majorName || 'Not specified'}</p>
          </div>
          
          <div>
            <h4 className="font-medium">Degree</h4>
            <p>{initialData.degree ? initialData.degree.toUpperCase() : 'Not specified'}</p>
          </div>
          
          {sportsNames.length > 0 && (
            <div>
              <h4 className="font-medium">Sports</h4>
              <p>{sportsNames.join(', ')}</p>
            </div>
          )}
          
          {clubsNames.length > 0 && (
            <div>
              <h4 className="font-medium">Clubs & Activities</h4>
              <p>{clubsNames.join(', ')}</p>
            </div>
          )}
          
          {greekLifeNames.length > 0 && (
            <div>
              <h4 className="font-medium">Greek Life</h4>
              <p>{greekLifeNames.join(', ')}</p>
            </div>
          )}
          
          {initialData.bio && (
            <div>
              <h4 className="font-medium">Bio</h4>
              <p className="text-sm">{initialData.bio}</p>
            </div>
          )}
          
          {initialData.pricing && (
            <div>
              <h4 className="font-medium">Consultation Rates</h4>
              <div className="space-y-1 text-sm">
                {initialData.pricing.price_15_min !== null && (
                  <p>15 minutes: ${initialData.pricing.price_15_min}</p>
                )}
                {initialData.pricing.price_30_min !== null && (
                  <p>30 minutes: ${initialData.pricing.price_30_min}</p>
                )}
                {initialData.pricing.price_60_min !== null && (
                  <p>60 minutes: ${initialData.pricing.price_60_min}</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={handleComplete}>
          Complete Setup
        </Button>
      </div>
    </div>
  );
};

export default SummaryStep;
