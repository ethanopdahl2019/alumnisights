
import React from "react";

interface AlphabeticalNavProps {
  letters: string[];
  onLetterClick: (letter: string) => void;
  activeLetter: string | null;
}

const AlphabeticalNav: React.FC<AlphabeticalNavProps> = ({ 
  letters, 
  onLetterClick,
  activeLetter
}) => {
  return (
    <div className="hidden md:flex flex-col bg-white rounded-lg shadow-md p-2 sticky top-24 self-start">
      {letters.map(letter => (
        <button
          key={letter}
          onClick={() => onLetterClick(letter)}
          className={`w-8 h-8 flex items-center justify-center rounded-full my-0.5 text-sm transition-all 
            ${activeLetter === letter 
              ? "bg-blue-600 text-white" 
              : "hover:bg-blue-100 text-navy"}`}
        >
          {letter}
        </button>
      ))}
    </div>
  );
};

export default AlphabeticalNav;
