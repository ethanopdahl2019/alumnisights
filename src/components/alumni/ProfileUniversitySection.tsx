
import React from 'react';
import { Control } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ProfileFormValues } from './AlumniProfileForm';

// Define the list of prestigious universities
const prestigiousUniversities = [
  { id: "harvard", name: "Harvard" },
  { id: "stanford", name: "Stanford" },
  { id: "mit", name: "MIT" },
  { id: "caltech", name: "Caltech" },
  { id: "uchicago", name: "UChicago" },
  { id: "upenn", name: "UPenn" },
  { id: "yale", name: "Yale" },
  { id: "columbia", name: "Columbia" },
  { id: "princeton", name: "Princeton" },
  { id: "berkeley", name: "UC Berkeley" },
  { id: "ucla", name: "UCLA" },
  { id: "cornell", name: "Cornell" },
  { id: "michigan", name: "Michigan" },
  { id: "duke", name: "Duke" },
  { id: "northwestern", name: "Northwestern" },
  { id: "nyu", name: "NYU" },
  { id: "usc", name: "USC" },
  { id: "carnegie", name: "Carnegie Mellon" },
  { id: "unc", name: "UNC" },
  { id: "brown", name: "Brown" },
  { id: "uw", name: "UW" },
  { id: "ucsd", name: "UCSD" },
  { id: "wisconsin", name: "Wisconsin" },
  { id: "uiuc", name: "UIUC" },
  { id: "gatech", name: "Georgia Tech" },
  { id: "utaustin", name: "UT Austin" },
  { id: "florida", name: "Florida" },
  { id: "bu", name: "BU" },
  { id: "ucdavis", name: "UC Davis" },
  { id: "ucsb", name: "UC Santa Barbara" },
  { id: "emory", name: "Emory" },
  { id: "uva", name: "UVA" },
  { id: "amherst", name: "Amherst" },
  { id: "maryland", name: "Maryland" },
];

// Define the available degrees
const degrees = [
  { id: "bachelors", name: "Bachelor's Degree" },
  { id: "masters", name: "Master's Degree" },
  { id: "phd", name: "PhD" },
  { id: "associates", name: "Associate's Degree" },
  { id: "other", name: "Other" }
];

interface ProfileUniversitySectionProps {
  control: Control<ProfileFormValues>;
  isLoading: boolean;
}

const ProfileUniversitySection: React.FC<ProfileUniversitySectionProps> = ({ control, isLoading }) => {
  return (
    <>
      <FormField
        control={control}
        name="universityId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>University</FormLabel>
            <Select 
              onValueChange={field.onChange} 
              value={field.value}
              disabled={isLoading}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select your university" />
                </SelectTrigger>
              </FormControl>
              <SelectContent className="max-h-[300px]">
                {prestigiousUniversities.map((university) => (
                  <SelectItem key={university.id} value={university.id}>
                    {university.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name="degree"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Degree</FormLabel>
            <Select 
              onValueChange={field.onChange} 
              defaultValue={field.value}
              disabled={isLoading}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select your degree" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {degrees.map((degree) => (
                  <SelectItem key={degree.id} value={degree.id}>
                    {degree.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default ProfileUniversitySection;
