
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

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
    <div className="flex justify-end space-x-4 pt-4">
      <Button 
        type="button" 
        variant="outline" 
        onClick={onCancel}
      >
        Skip for now
      </Button>
      <Button 
        type="submit" 
        disabled={isLoading || progress < 100}
        className={progress < 100 ? "opacity-70" : ""}
      >
        {isLoading ? "Saving..." : "Complete Alumni Profile"}
      </Button>
    </div>
  );
};

export default ProfileFormActions;
