
import React from 'react';
import { Progress } from '@/components/ui/progress';

interface ProfileProgressProps {
  progress: number;
}

const ProfileProgress: React.FC<ProfileProgressProps> = ({ progress }) => {
  return (
    <div className="mt-6">
      <Progress value={progress} className="h-2 w-full" />
      <p className="text-sm text-gray-500 mt-2">
        Profile completion: {Math.round(progress)}%
      </p>
    </div>
  );
};

export default ProfileProgress;
