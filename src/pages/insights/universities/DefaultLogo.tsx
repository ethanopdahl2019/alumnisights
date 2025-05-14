
import React from 'react';
import { GraduationCap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DefaultLogoProps {
  name: string;
  className?: string;
}

const DefaultLogo: React.FC<DefaultLogoProps> = ({ name, className }) => {
  // Get initials from university name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };
  
  // Generate a deterministic background color based on name
  const getBackgroundColor = (name: string) => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    const colors = [
      'bg-blue-100 text-blue-800',
      'bg-green-100 text-green-800',
      'bg-purple-100 text-purple-800',
      'bg-pink-100 text-pink-800',
      'bg-yellow-100 text-yellow-800',
      'bg-indigo-100 text-indigo-800',
      'bg-red-100 text-red-800',
      'bg-cyan-100 text-cyan-800',
    ];
    
    const index = Math.abs(hash) % colors.length;
    return colors[index];
  };
  
  const colorClasses = getBackgroundColor(name);
  const initials = getInitials(name);

  return (
    <div 
      className={cn(
        'flex items-center justify-center rounded-full', 
        colorClasses,
        className
      )}
    >
      {initials.length > 0 ? (
        <span className="font-bold">{initials}</span>
      ) : (
        <GraduationCap className="h-5 w-5" />
      )}
    </div>
  );
};

export default DefaultLogo;
