
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { OnboardingStep, OnboardingData } from '@/types/onboarding';
import SchoolStep from './steps/SchoolStep';
import MajorStep from './steps/MajorStep';
import DegreeStep from './steps/DegreeStep';
import SportsStep from './steps/SportsStep';
import ClubsStep from './steps/ClubsStep';
import GreekLifeStep from './steps/GreekLifeStep';
import BioStep from './steps/BioStep';
import PricingStep from './steps/PricingStep';
import SummaryStep from './steps/SummaryStep';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (data: OnboardingData) => Promise<void>;
  userType: 'applicant' | 'alumni';
}

const OnboardingModal = ({ isOpen, onClose, onComplete, userType }: OnboardingModalProps) => {
  // Define the steps for the onboarding flow
  const baseSteps: OnboardingStep[] = [
    { id: 'school', title: 'School' },
    { id: 'major', title: 'Major' },
    { id: 'degree', title: 'Degree' },
    { id: 'sports', title: 'Sports' },
    { id: 'clubs', title: 'Clubs & Activities' },
    { id: 'greekLife', title: 'Greek Life' },
    { id: 'bio', title: 'Bio' },
  ];
  
  // Add pricing step only for alumni
  const steps = userType === 'alumni' 
    ? [...baseSteps, { id: 'pricing', title: 'Pricing' }, { id: 'summary', title: 'Summary' }] 
    : [...baseSteps, { id: 'summary', title: 'Summary' }];
  
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({});
  
  const currentStep = steps[currentStepIndex];
  const progress = ((currentStepIndex) / (steps.length - 1)) * 100;
  
  const handleNext = (stepData?: any) => {
    // Save step data
    setOnboardingData(prev => ({ ...prev, ...(stepData || {}) }));
    
    // Move to next step or complete onboarding
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      handleComplete();
    }
  };
  
  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };
  
  const handleComplete = async () => {
    await onComplete(onboardingData);
  };
  
  const renderStep = () => {
    switch (currentStep.id) {
      case 'school':
        return <SchoolStep onNext={handleNext} initialData={onboardingData} />;
      case 'major':
        return <MajorStep onNext={handleNext} onBack={handleBack} initialData={onboardingData} />;
      case 'degree':
        return <DegreeStep onNext={handleNext} onBack={handleBack} initialData={onboardingData} />;
      case 'sports':
        return <SportsStep onNext={handleNext} onBack={handleBack} initialData={onboardingData} />;
      case 'clubs':
        return <ClubsStep onNext={handleNext} onBack={handleBack} initialData={onboardingData} />;
      case 'greekLife':
        return <GreekLifeStep onNext={handleNext} onBack={handleBack} initialData={onboardingData} />;
      case 'bio':
        return <BioStep onNext={handleNext} onBack={handleBack} initialData={onboardingData} />;
      case 'pricing':
        return <PricingStep onNext={handleNext} onBack={handleBack} initialData={onboardingData} />;
      case 'summary':
        return <SummaryStep onNext={handleComplete} onBack={handleBack} initialData={onboardingData} />;
      default:
        return null;
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Complete Your Profile</DialogTitle>
          <DialogDescription>
            {currentStep.description || 'Follow these steps to set up your profile.'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-500 mb-2">
            <span>Step {currentStepIndex + 1} of {steps.length}</span>
            <span>{currentStep.title}</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
        
        <div className="py-4">
          {renderStep()}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OnboardingModal;
