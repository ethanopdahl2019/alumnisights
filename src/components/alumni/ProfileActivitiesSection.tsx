
import React from 'react';
import { Control } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import SearchInput from '@/components/SearchInput';
import { ProfileFormValues } from './AlumniProfileForm';

interface ProfileActivitiesSectionProps {
  control: Control<ProfileFormValues>;
  activities: any[];
  greekLifeOptions: any[];
  filteredMajors: any[];
  setMajorSearchTerm: (term: string) => void;
  majorSearchTerm: string;
}

const ProfileActivitiesSection: React.FC<ProfileActivitiesSectionProps> = ({
  control,
  activities,
  greekLifeOptions,
  filteredMajors,
  setMajorSearchTerm,
  majorSearchTerm
}) => {
  return (
    <>
      <FormField
        control={control}
        name="majorId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Major</FormLabel>
            <FormControl>
              <SearchInput
                value={majorSearchTerm}
                onChange={setMajorSearchTerm}
                placeholder="Type to search majors..."
                options={filteredMajors}
                onOptionSelect={(major) => {
                  field.onChange(major.id);
                  setMajorSearchTerm(major.name);
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    
      <FormField
        control={control}
        name="greekLife"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Greek Life</FormLabel>
            <Select 
              onValueChange={field.onChange}
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select Greek organization (if any)" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                {greekLifeOptions.map((option) => (
                  <SelectItem key={option.id} value={option.id}>
                    {option.name}
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
        name="activities"
        render={() => (
          <FormItem>
            <div className="mb-4">
              <FormLabel className="text-base">Activities</FormLabel>
              <p className="text-sm text-gray-500">
                Select the activities you were involved in
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {activities.map((activity) => (
                <FormField
                  key={activity.id}
                  control={control}
                  name="activities"
                  render={({ field }) => (
                    <FormItem
                      key={activity.id}
                      className="flex flex-row items-start space-x-3 space-y-0"
                    >
                      <FormControl>
                        <Checkbox
                          checked={field.value?.includes(activity.id)}
                          onCheckedChange={(checked) => {
                            return checked
                              ? field.onChange([...field.value, activity.id])
                              : field.onChange(
                                  field.value?.filter(
                                    (value) => value !== activity.id
                                  )
                                );
                          }}
                        />
                      </FormControl>
                      <FormLabel className="font-normal">
                        {activity.name}
                      </FormLabel>
                    </FormItem>
                  )}
                />
              ))}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default ProfileActivitiesSection;
