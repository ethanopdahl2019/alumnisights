
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { OnboardingStepProps, DegreeType } from '@/types/onboarding';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

const degreeOptions = [
  { value: 'ba', label: 'Bachelor of Arts (BA)' },
  { value: 'bs', label: 'Bachelor of Science (BS)' },
  { value: 'ma', label: 'Master of Arts (MA)' },
  { value: 'ms', label: 'Master of Science (MS)' },
  { value: 'mba', label: 'Master of Business Administration (MBA)' },
  { value: 'phd', label: 'Doctor of Philosophy (PhD)' },
  { value: 'md', label: 'Doctor of Medicine (MD)' },
  { value: 'jd', label: 'Juris Doctor (JD)' },
  { value: 'other', label: 'Other' }
];

const DegreeStep = ({ onNext, onBack, initialData }: OnboardingStepProps) => {
  const [selectedDegree, setSelectedDegree] = useState<DegreeType | undefined>(
    initialData?.degree as DegreeType | undefined
  );
  
  const handleNext = () => {
    if (selectedDegree) {
      onNext({ degree: selectedDegree });
    }
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Select Your Degree</h3>
        <p className="text-gray-600 mb-4">
          Choose the type of degree you earned or are pursuing.
        </p>
        
        <RadioGroup
          value={selectedDegree}
          onValueChange={(value) => setSelectedDegree(value as DegreeType)}
          className="space-y-2"
        >
          {degreeOptions.map((option) => (
            <div key={option.value} className="flex items-center space-x-2">
              <RadioGroupItem value={option.value} id={`degree-${option.value}`} />
              <Label htmlFor={`degree-${option.value}`}>{option.label}</Label>
            </div>
          ))}
        </RadioGroup>
      </div>
      
      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={handleNext} disabled={!selectedDegree}>
          Next
        </Button>
      </div>
    </div>
  );
};

export default DegreeStep;
