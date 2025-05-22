
import React from 'react';
import { Progress } from '@/components/ui/progress';

interface ProfileProgressProps {
  progress: number;
}

const ProfileProgress: React.FC<ProfileProgressProps> = ({ progress }) => {
  // Ensure progress is always between 0 and 100
  const safeProgress = Math.max(0, Math.min(100, progress));
  
  return (
    <div className="mt-6">
      <Progress value={safeProgress} className="h-2 w-full" />
      <p className="text-sm text-gray-500 mt-2">
        Profile completion: {Math.round(safeProgress)}%
      </p>
    </div>
  );
};

export default ProfileProgress;
