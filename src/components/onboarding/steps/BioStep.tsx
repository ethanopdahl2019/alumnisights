
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { OnboardingStepProps } from '@/types/onboarding';
import { Textarea } from '@/components/ui/textarea';

const BioStep = ({ onNext, onBack, initialData }: OnboardingStepProps) => {
  const [bio, setBio] = useState(initialData?.bio || '');
  
  const handleNext = () => {
    onNext({ bio });
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Tell Us About Yourself</h3>
        <p className="text-gray-600 mb-4">
          Write a short bio to introduce yourself to others on the platform.
        </p>
        
        <Textarea
          placeholder="Share your interests, experiences, or what you can offer to others..."
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className="min-h-[150px]"
        />
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

export default BioStep;
