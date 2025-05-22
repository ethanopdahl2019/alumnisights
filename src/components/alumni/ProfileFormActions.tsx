
import React from 'react';
import { Button } from '@/components/ui/button';

interface ProfileFormActionsProps {
  isLoading: boolean;
  progress: number;
  onCancel: () => void;
}

const ProfileFormActions: React.FC<ProfileFormActionsProps> = ({ 
  isLoading, 
  progress, 
  onCancel 
}) => {
  return (
    <div className="flex justify-end space-x-4 pt-6">
      <Button 
        type="button" 
        variant="outline" 
        onClick={onCancel}
        disabled={isLoading}
      >
        Cancel
      </Button>
      <Button 
        type="submit" 
        disabled={isLoading}
        className={progress < 50 ? "opacity-90" : ""}
      >
        {isLoading ? "Saving..." : "Complete Profile"}
      </Button>
    </div>
  );
};

export default ProfileFormActions;
