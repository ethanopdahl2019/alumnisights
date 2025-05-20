
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { OnboardingStepProps, GreekLife } from '@/types/onboarding';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { getGreekLife } from '@/services/activities';

const GreekLifeStep = ({ onNext, onBack, initialData }: OnboardingStepProps) => {
  const [greekOrgs, setGreekOrgs] = useState<GreekLife[]>([]);
  const [selectedOrgs, setSelectedOrgs] = useState<string[]>(initialData?.greekLife || []);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    const fetchGreekLife = async () => {
      setIsLoading(true);
      try {
        const orgsData = await getGreekLife();
        setGreekOrgs(orgsData);
      } catch (error) {
        console.error("Error fetching Greek life organizations:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchGreekLife();
  }, []);
  
  const handleOrgToggle = (orgId: string) => {
    setSelectedOrgs(prev => {
      if (prev.includes(orgId)) {
        return prev.filter(id => id !== orgId);
      } else {
        return [...prev, orgId];
      }
    });
  };
  
  const filteredOrgs = searchTerm 
    ? greekOrgs.filter(org => org.name.toLowerCase().includes(searchTerm.toLowerCase()))
    : greekOrgs;
  
  // Group organizations by type
  const fraternities = filteredOrgs.filter(org => org.type === 'fraternity');
  const sororities = filteredOrgs.filter(org => org.type === 'sorority');
  const other = filteredOrgs.filter(org => org.type === 'other');
  
  const handleNext = () => {
    onNext({ greekLife: selectedOrgs });
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Greek Life</h3>
        <p className="text-gray-600 mb-4">
          Select any fraternities, sororities or other Greek organizations you're involved with (optional).
        </p>
        
        <div className="mb-4">
          <Input
            placeholder="Search organizations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-4"
          />
          
          {isLoading ? (
            <div className="py-4 text-center">Loading organizations...</div>
          ) : (
            <div className="max-h-[300px] overflow-y-auto border rounded-md p-4">
              {filteredOrgs.length > 0 ? (
                <div className="space-y-6">
                  {fraternities.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">Fraternities</h4>
                      <div className="grid grid-cols-2 gap-3">
                        {fraternities.map((org) => (
                          <div key={org.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={`org-${org.id}`}
                              checked={selectedOrgs.includes(org.id)}
                              onCheckedChange={() => handleOrgToggle(org.id)}
                            />
                            <Label htmlFor={`org-${org.id}`} className="text-sm">{org.name}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {sororities.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">Sororities</h4>
                      <div className="grid grid-cols-2 gap-3">
                        {sororities.map((org) => (
                          <div key={org.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={`org-${org.id}`}
                              checked={selectedOrgs.includes(org.id)}
                              onCheckedChange={() => handleOrgToggle(org.id)}
                            />
                            <Label htmlFor={`org-${org.id}`} className="text-sm">{org.name}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {other.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">Other Organizations</h4>
                      <div className="grid grid-cols-2 gap-3">
                        {other.map((org) => (
                          <div key={org.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={`org-${org.id}`}
                              checked={selectedOrgs.includes(org.id)}
                              onCheckedChange={() => handleOrgToggle(org.id)}
                            />
                            <Label htmlFor={`org-${org.id}`} className="text-sm">{org.name}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="py-4 text-center text-gray-500">No organizations found</div>
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

export default GreekLifeStep;
