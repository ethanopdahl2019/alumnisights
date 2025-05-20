
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import SearchInput from '@/components/SearchInput';
import { getAllUniversities, UniversityData } from '@/pages/insights/universities/universities-data';
import { supabase } from '@/integrations/supabase/client';

interface SchoolAndMajorProps {
  profileData: {
    schoolId: string;
    majorId: string;
    degree: string;
    graduationYear: number | undefined;
  };
  updateProfileData: (data: Partial<SchoolAndMajorProps['profileData']>) => void;
  onNext: () => void;
  onBack: () => void;
}

const DEGREES = [
  { id: 'ba', name: 'BA - Bachelor of Arts' },
  { id: 'bs', name: 'BS - Bachelor of Science' },
  { id: 'ma', name: 'MA - Master of Arts' },
  { id: 'ms', name: 'MS - Master of Science' },
  { id: 'mba', name: 'MBA - Master of Business Administration' },
  { id: 'phd', name: 'PhD - Doctor of Philosophy' },
  { id: 'jd', name: 'JD - Juris Doctor' },
  { id: 'md', name: 'MD - Doctor of Medicine' },
  { id: 'other', name: 'Other' },
];

const SchoolAndMajor: React.FC<SchoolAndMajorProps> = ({
  profileData,
  updateProfileData,
  onNext,
  onBack,
}) => {
  const [isValid, setIsValid] = useState(true);
  const [universities, setUniversities] = useState<UniversityData[]>([]);
  const [majors, setMajors] = useState<{ id: string; name: string }[]>([]);
  const [universitySearchTerm, setUniversitySearchTerm] = useState('');
  const [majorSearchTerm, setMajorSearchTerm] = useState('');
  const [selectedUniversityName, setSelectedUniversityName] = useState('');
  const [selectedMajorName, setSelectedMajorName] = useState('');
  const currentYear = new Date().getFullYear();
  const graduationYears = Array.from({ length: 70 }, (_, i) => currentYear - i);

  // Fetch universities and majors
  useEffect(() => {
    const fetchData = async () => {
      try {
        const universitiesData = await getAllUniversities();
        setUniversities(universitiesData);
        
        // If we have a selected university, set the search term
        if (profileData.schoolId) {
          const selectedUni = universitiesData.find(uni => uni.id === profileData.schoolId);
          if (selectedUni) {
            setSelectedUniversityName(selectedUni.name);
          }
        }
        
        // Fetch majors from Supabase
        const { data: majorsData, error } = await supabase
          .from('majors')
          .select('id, name')
          .order('name');
        
        if (error) throw error;
        
        setMajors(majorsData || []);
        
        // If we have a selected major, set the search term
        if (profileData.majorId) {
          const selectedMajorData = majorsData?.find(major => major.id === profileData.majorId);
          if (selectedMajorData) {
            setSelectedMajorName(selectedMajorData.name);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    
    fetchData();
  }, [profileData.schoolId, profileData.majorId]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!profileData.schoolId || !profileData.degree) {
      setIsValid(false);
      return;
    }
    
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="university">University *</Label>
          <SearchInput 
            value={universitySearchTerm || selectedUniversityName}
            onChange={setUniversitySearchTerm}
            placeholder="Type to search universities..."
            options={universities}
            onOptionSelect={(university) => {
              updateProfileData({ schoolId: university.id });
              setSelectedUniversityName(university.name);
              setUniversitySearchTerm(university.name);
            }}
          />
          {!isValid && !profileData.schoolId && (
            <p className="text-red-500 text-sm">University is required</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="major">Major</Label>
          <SearchInput 
            value={majorSearchTerm || selectedMajorName}
            onChange={setMajorSearchTerm}
            placeholder="Type to search majors..."
            options={majors}
            onOptionSelect={(major) => {
              updateProfileData({ majorId: major.id });
              setSelectedMajorName(major.name);
              setMajorSearchTerm(major.name);
            }}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="degree">Degree *</Label>
          <Select 
            value={profileData.degree} 
            onValueChange={(value) => updateProfileData({ degree: value })}
          >
            <SelectTrigger id="degree" className={!isValid && !profileData.degree ? "border-red-500" : ""}>
              <SelectValue placeholder="Select your degree" />
            </SelectTrigger>
            <SelectContent>
              {DEGREES.map(degree => (
                <SelectItem key={degree.id} value={degree.id}>
                  {degree.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {!isValid && !profileData.degree && (
            <p className="text-red-500 text-sm">Degree is required</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="graduation-year">Graduation Year</Label>
          <Select 
            value={profileData.graduationYear?.toString() || ''} 
            onValueChange={(value) => updateProfileData({ graduationYear: parseInt(value) })}
          >
            <SelectTrigger id="graduation-year">
              <SelectValue placeholder="Select your graduation year" />
            </SelectTrigger>
            <SelectContent>
              {graduationYears.map(year => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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

export default SchoolAndMajor;
