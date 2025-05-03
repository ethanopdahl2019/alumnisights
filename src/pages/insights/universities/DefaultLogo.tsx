
import React from "react";

interface DefaultLogoProps {
  name: string;
  className?: string;
}

const DefaultLogo: React.FC<DefaultLogoProps> = ({ name, className = "" }) => {
  // Create initials from university name
  const initials = name
    .split(' ')
    .filter(word => !['of', 'and', 'the', 'at', 'in'].includes(word.toLowerCase()))
    .map(word => word[0])
    .slice(0, 2)
    .join('');

  return (
    <div className={`flex items-center justify-center bg-blue-50 rounded-full ${className}`}>
      <span className="font-semibold text-blue-600 text-lg">
        {initials.toUpperCase()}
      </span>
    </div>
  );
};

export default DefaultLogo;
