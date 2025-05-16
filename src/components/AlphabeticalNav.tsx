
import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';

interface AlphabeticalNavProps {
  letters: string[];
  onLetterClick: (letter: string) => void;
  activeLetter: string | null;
}

const AlphabeticalNav = ({ letters, onLetterClick, activeLetter }: AlphabeticalNavProps) => {
  // Adding scroll highlight functionality
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    // Add scroll listener to update active letter based on scroll position
    const handleScroll = () => {
      setIsScrolling(true);
      // Clear the timeout if it exists
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      
      // Set a timeout to detect when scrolling stops
      scrollTimeoutRef.current = window.setTimeout(() => {
        setIsScrolling(false);
      }, 150);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  return (
    <motion.nav 
      className="hidden md:flex flex-col items-center sticky top-24 self-start"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="bg-white rounded-lg shadow-sm p-3">
        <ul className="flex flex-col gap-2">
          {letters.map((letter) => (
            <motion.li key={letter}>
              <motion.button
                className={`w-8 h-8 flex items-center justify-center rounded-md text-sm transition-all ${
                  activeLetter === letter
                    ? 'bg-navy text-white font-medium'
                    : 'hover:bg-gray-100 text-gray-600'
                }`}
                onClick={() => onLetterClick(letter)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                animate={
                  activeLetter === letter && isScrolling
                    ? { scale: [1, 1.15, 1], transition: { duration: 0.3 } }
                    : {}
                }
              >
                {letter}
              </motion.button>
            </motion.li>
          ))}
        </ul>
      </div>
    </motion.nav>
  );
};

export default AlphabeticalNav;
