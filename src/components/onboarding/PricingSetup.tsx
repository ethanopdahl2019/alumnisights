
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';

interface PricingSetupProps {
  profileData: {
    price15Min: number | undefined;
    price30Min: number | undefined;
    price60Min: number | undefined;
  };
  updateProfileData: (data: Partial<PricingSetupProps['profileData']>) => void;
  onSubmit: () => void;
  onBack: () => void;
  isLoading: boolean;
}

const PricingSetup: React.FC<PricingSetupProps> = ({
  profileData,
  updateProfileData,
  onSubmit,
  onBack,
  isLoading,
}) => {
  const [isValid, setIsValid] = useState(true);
  
  const handlePriceChange = (field: keyof PricingSetupProps['profileData'], value: string) => {
    const numValue = value ? parseInt(value) : undefined;
    updateProfileData({ [field]: numValue });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate that at least one price is set
    if (!profileData.price15Min && !profileData.price30Min && !profileData.price60Min) {
      setIsValid(false);
      return;
    }
    
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Set Your Session Pricing</h3>
        <p className="text-gray-500 mb-6">
          Set prices for different session durations. You can always change these later.
          Please set at least one price option.
        </p>
        
        {!isValid && (
          <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4">
            Please set at least one pricing option.
          </div>
        )}
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 items-center">
            <Label htmlFor="price-15" className="font-medium">15-Minute Session</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
              <Input
                id="price-15"
                type="number"
                className="pl-7"
                min="0"
                placeholder="0"
                value={profileData.price15Min !== undefined ? profileData.price15Min : ''}
                onChange={(e) => handlePriceChange('price15Min', e.target.value)}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 items-center">
            <Label htmlFor="price-30" className="font-medium">30-Minute Session</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
              <Input
                id="price-30"
                type="number"
                className="pl-7"
                min="0"
                placeholder="0"
                value={profileData.price30Min !== undefined ? profileData.price30Min : ''}
                onChange={(e) => handlePriceChange('price30Min', e.target.value)}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 items-center">
            <Label htmlFor="price-60" className="font-medium">60-Minute Session</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
              <Input
                id="price-60"
                type="number"
                className="pl-7"
                min="0"
                placeholder="0"
                value={profileData.price60Min !== undefined ? profileData.price60Min : ''}
                onChange={(e) => handlePriceChange('price60Min', e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
      
      <div className="pt-4 flex justify-between">
        <Button type="button" variant="outline" onClick={onBack} disabled={isLoading}>
          Back
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Completing Setup
            </>
          ) : (
            'Complete Profile'
          )}
        </Button>
      </div>
    </form>
  );
};

export default PricingSetup;
