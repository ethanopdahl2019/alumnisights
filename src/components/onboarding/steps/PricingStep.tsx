
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { OnboardingStepProps, PricingInfo } from '@/types/onboarding';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const PricingStep = ({ onNext, onBack, initialData }: OnboardingStepProps) => {
  const [pricing, setPricing] = useState<PricingInfo>({
    price_15_min: initialData?.pricing?.price_15_min || null,
    price_30_min: initialData?.pricing?.price_30_min || null,
    price_60_min: initialData?.pricing?.price_60_min || null,
  });
  
  const handleChange = (field: keyof PricingInfo, value: string) => {
    const numValue = value === '' ? null : Number(value);
    setPricing(prev => ({
      ...prev,
      [field]: numValue
    }));
  };
  
  const handleNext = () => {
    onNext({ pricing });
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Set Your Consultation Rates</h3>
        <p className="text-gray-600 mb-4">
          Specify your rates for different consultation durations. Leave blank if you don't offer a specific duration.
        </p>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="price-15">15 Minute Rate (USD)</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2">$</span>
              <Input
                id="price-15"
                type="number"
                min="0"
                placeholder="0"
                value={pricing.price_15_min === null ? '' : pricing.price_15_min}
                onChange={(e) => handleChange('price_15_min', e.target.value)}
                className="pl-7"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="price-30">30 Minute Rate (USD)</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2">$</span>
              <Input
                id="price-30"
                type="number"
                min="0"
                placeholder="0"
                value={pricing.price_30_min === null ? '' : pricing.price_30_min}
                onChange={(e) => handleChange('price_30_min', e.target.value)}
                className="pl-7"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="price-60">60 Minute Rate (USD)</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2">$</span>
              <Input
                id="price-60"
                type="number"
                min="0"
                placeholder="0"
                value={pricing.price_60_min === null ? '' : pricing.price_60_min}
                onChange={(e) => handleChange('price_60_min', e.target.value)}
                className="pl-7"
              />
            </div>
          </div>
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

export default PricingStep;
