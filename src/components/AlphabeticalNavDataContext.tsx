
import React, { createContext, useContext, ReactNode, useState } from 'react';

interface AlphabeticalNavDataContextProps {
  activeLetter: string | null;
  setActiveLetter: (letter: string | null) => void;
  updateActiveLetter: (letters: string[], elementId?: string) => void;
}

const AlphabeticalNavDataContext = createContext<AlphabeticalNavDataContextProps | undefined>(undefined);

export const AlphabeticalNavDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeLetter, setActiveLetter] = useState<string | null>(null);
  
  // Helper function to update the active letter based on scroll position
  const updateActiveLetter = (letters: string[], elementId?: string) => {
    if (letters.length === 0) {
      setActiveLetter(null);
      return;
    }
    
    const scrollY = window.scrollY;
    const headerOffset = 100; // Adjust based on your header height
    
    for (const letter of letters) {
      const element = document.getElementById(elementId ? `${elementId}-${letter}` : letter);
      
      if (element) {
        const elementTop = element.getBoundingClientRect().top + scrollY;
        
        if (elementTop - headerOffset <= scrollY) {
          setActiveLetter(letter);
        } else if (scrollY === 0) {
          // When at the top of the page, activate the first letter
          setActiveLetter(letters[0]);
          break;
        }
      }
    }
  };
  
  return (
    <AlphabeticalNavDataContext.Provider 
      value={{ 
        activeLetter, 
        setActiveLetter, 
        updateActiveLetter 
      }}
    >
      {children}
    </AlphabeticalNavDataContext.Provider>
  );
};

export const useAlphabeticalNavData = () => {
  const context = useContext(AlphabeticalNavDataContext);
  if (context === undefined) {
    throw new Error('useAlphabeticalNavData must be used within an AlphabeticalNavDataProvider');
  }
  return context;
};
