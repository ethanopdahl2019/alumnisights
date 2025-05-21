
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/components/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { getSchools } from '@/services/profiles';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SearchInput from '@/components/SearchInput';

const ApplicantProfileComplete = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [schools, setSchools] = useState<any[]>([]);
  const [selectedSchools, setSelectedSchools] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  
  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    
    // Load all schools
    const loadSchools = async () => {
      try {
        const schoolsData = await getSchools();
        setSchools(schoolsData);
      } catch (error) {
        console.error('[ApplicantProfileComplete] Error loading schools:', error);
        toast("Failed to load schools. Please try again later.");
      }
    };
    
    loadSchools();
  }, [user, navigate]);
  
  // Update progress based on number of schools selected
  useEffect(() => {
    const progressValue = (selectedSchools.length / 3) * 100;
    setProgress(Math.min(progressValue, 100));
  }, [selectedSchools]);
  
  const handleSelectSchool = (school: any) => {
    if (selectedSchools.length >= 3) {
      toast("You can only select up to 3 dream schools");
      return;
    }
    
    // Check if school already selected
    if (selectedSchools.some(s => s.id === school.id)) {
      return;
    }
    
    setSelectedSchools([...selectedSchools, school]);
    setSearchTerm("");
  };
  
  const handleRemoveSchool = (schoolId: string) => {
    setSelectedSchools(selectedSchools.filter(school => school.id !== schoolId));
  };
  
  const handleSubmit = async () => {
    if (selectedSchools.length === 0) {
      toast("Please select at least one dream school");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Check if profile already exists
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user!.id)
        .single();
      
      let profileId;
      
      if (!existingProfile) {
        // Create a basic profile for the applicant
        // Note: We set null values for required fields temporarily
        // These will be updated later in the applicant journey
        const { data: newProfile, error: profileError } = await supabase
          .from('profiles')
          .insert({
            user_id: user!.id,
            name: `${user!.user_metadata.first_name} ${user!.user_metadata.last_name}`,
            role: 'applicant',
            // Add placeholder values for required fields
            school_id: null,
            major_id: null
          })
          .select('id')
          .single();
        
        if (profileError) throw profileError;
        profileId = newProfile.id;
      } else {
        profileId = existingProfile.id;
      }
      
      // Store dream schools using a direct call to the add_dream_school function
      // Instead of using rpc which has TypeScript limitations, we'll use a direct 
      // SQL query through the functions endpoint
      for (const school of selectedSchools) {
        const { error } = await supabase
          .from('applicant_dream_schools')
          .insert({
            profile_id: profileId,
            school_id: school.id
          });
        
        if (error) {
          console.error('Error adding dream school:', error);
          throw error;
        }
      }
      
      toast("Profile completed successfully!");
      navigate('/applicant-dashboard');
    } catch (error: any) {
      console.error('[ApplicantProfileComplete] Error saving profile:', error);
      toast("Failed to save profile: " + (error.message || "Please try again."));
    } finally {
      setIsLoading(false);
    }
  };
  
  // Filter schools based on search term
  const filteredSchools = searchTerm
    ? schools.filter(school => 
        school.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow container mx-auto py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Complete Your Applicant Profile</h1>
            <p className="text-gray-600">
              Select up to 3 dream schools you're interested in applying to
            </p>
            
            <div className="mt-6">
              <Progress value={progress} className="h-2 w-full" />
              <p className="text-sm text-gray-500 mt-2">
                Profile completion: {Math.round(progress)}%
              </p>
            </div>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Your Dream Schools</CardTitle>
              <CardDescription>
                Select up to 3 schools you're most interested in applying to
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <SearchInput
                    value={searchTerm}
                    onChange={setSearchTerm}
                    placeholder="Search for schools..."
                    options={filteredSchools}
                    onOptionSelect={handleSelectSchool}
                  />
                </div>
                
                <div className="mt-4">
                  <h3 className="text-sm font-medium mb-2">Selected Schools ({selectedSchools.length}/3):</h3>
                  {selectedSchools.length === 0 ? (
                    <p className="text-sm text-gray-500">No schools selected yet</p>
                  ) : (
                    <div className="space-y-2">
                      {selectedSchools.map((school) => (
                        <div key={school.id} className="flex items-center justify-between border rounded-md px-3 py-2">
                          <span>{school.name}</span>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleRemoveSchool(school.id)}
                          >
                            Remove
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="flex justify-end space-x-4 pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => navigate('/')}
                  >
                    Skip for now
                  </Button>
                  <Button 
                    type="button" 
                    onClick={handleSubmit}
                    disabled={isLoading || selectedSchools.length === 0}
                  >
                    {isLoading ? "Saving..." : "Complete Profile"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ApplicantProfileComplete;
