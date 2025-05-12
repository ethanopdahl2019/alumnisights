
import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';

interface AlphabeticalNavDataContextProps {
  activeLetter: string | null;
  setActiveLetter: (letter: string | null) => void;
  updateActiveLetter: (letters: string[], elementId?: string) => void;
  registerScrollUpdate: (letters: string[], elementId?: string) => () => void;
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
    
    // Default to the first letter if we're at the top of the page
    if (scrollY === 0) {
      setActiveLetter(letters[0]);
      return;
    }
    
    // Find the active letter by checking which section is visible
    let currentActiveLetter = null;
    
    for (let i = letters.length - 1; i >= 0; i--) {
      const letter = letters[i];
      const element = document.getElementById(elementId ? `${elementId}-${letter}` : letter);
      
      if (element) {
        const elementTop = element.getBoundingClientRect().top + scrollY;
        
        if (elementTop - headerOffset <= scrollY) {
          currentActiveLetter = letter;
          break;
        }
      }
    }
    
    // If no letter is found to be active but we have letters, use the first one
    if (!currentActiveLetter && letters.length > 0) {
      currentActiveLetter = letters[0];
    }
    
    setActiveLetter(currentActiveLetter);
  };
  
  // Helper function to register scroll listener and auto-cleanup
  const registerScrollUpdate = (letters: string[], elementId?: string) => {
    const handleScroll = () => {
      updateActiveLetter(letters, elementId);
    };
    
    // Initialize with current scroll position
    updateActiveLetter(letters, elementId);
    
    // Add scroll event listener
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Return cleanup function
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  };
  
  return (
    <AlphabeticalNavDataContext.Provider 
      value={{ 
        activeLetter, 
        setActiveLetter, 
        updateActiveLetter,
        registerScrollUpdate 
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
