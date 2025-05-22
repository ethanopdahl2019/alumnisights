
import React from 'react';
import { Control } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ProfileFormValues } from './AlumniProfileForm';

interface ProfileRatesSectionProps {
  control: Control<ProfileFormValues>;
}

const ProfileRatesSection: React.FC<ProfileRatesSectionProps> = ({ control }) => {
  return (
    <div className="grid grid-cols-3 gap-4">
      <FormField
        control={control}
        name="rate15min"
        render={({ field }) => (
          <FormItem>
            <FormLabel>15 Min Rate ($)</FormLabel>
            <FormControl>
              <Input
                type="number"
                placeholder="25"
                {...field}
                onChange={(e) => field.onChange(e.target.value)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name="rate30min"
        render={({ field }) => (
          <FormItem>
            <FormLabel>30 Min Rate ($)</FormLabel>
            <FormControl>
              <Input
                type="number"
                placeholder="45"
                {...field}
                onChange={(e) => field.onChange(e.target.value)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name="rate60min"
        render={({ field }) => (
          <FormItem>
            <FormLabel>60 Min Rate ($)</FormLabel>
            <FormControl>
              <Input
                type="number"
                placeholder="80"
                {...field}
                onChange={(e) => field.onChange(e.target.value)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default ProfileRatesSection;
