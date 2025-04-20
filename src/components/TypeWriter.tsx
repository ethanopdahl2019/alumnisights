
import { useState, useEffect, useRef } from 'react';

interface TypeWriterProps {
  words: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  delayBetweenWords?: number;
}

const TypeWriter = ({
  words,
  typingSpeed = 150,
  deletingSpeed = 50,
  delayBetweenWords = 1500
}: TypeWriterProps) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    const currentWord = words[currentWordIndex];

    if (isWaiting) {
      timeoutRef.current = setTimeout(() => {
        setIsWaiting(false);
        setIsDeleting(true);
      }, delayBetweenWords);
      return;
    }

    if (isDeleting) {
      if (displayedText.length === 0) {
        setIsDeleting(false);
        setCurrentWordIndex((prev) => (prev + 1) % words.length);
      } else {
        timeoutRef.current = setTimeout(() => {
          setDisplayedText(currentWord.substring(0, displayedText.length - 1));
        }, deletingSpeed);
      }
    } else {
      if (displayedText.length === currentWord.length) {
        setIsWaiting(true);
      } else {
        timeoutRef.current = setTimeout(() => {
          setDisplayedText(currentWord.substring(0, displayedText.length + 1));
        }, typingSpeed);
      }
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [currentWordIndex, displayedText, isDeleting, isWaiting, words, typingSpeed, deletingSpeed, delayBetweenWords]);

  return (
    <span className="inline-flex">
      <span className="inline-block">{displayedText}</span>
      <span className="w-0.5 h-6 ml-1 inline-block bg-navy animate-cursor-blink"></span>
    </span>
  );
};

export default TypeWriter;
