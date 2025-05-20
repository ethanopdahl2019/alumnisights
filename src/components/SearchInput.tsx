
import React, { useState, useEffect, useRef } from "react";
import { Search } from "lucide-react";
import { Input } from "./ui/input";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  options?: Array<{ id: string; name: string }>;
  onOptionSelect?: (option: { id: string; name: string }) => void;
  isLoading?: boolean;
}

const SearchInput = ({ 
  value, 
  onChange, 
  placeholder = "Search...", 
  className = "",
  options = [],
  onOptionSelect,
  isLoading = false
}: SearchInputProps) => {
  const [showOptions, setShowOptions] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const filteredOptions = options.filter(option => 
    option.name.toLowerCase().includes(value.toLowerCase())
  ).slice(0, 5);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowOptions(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative w-full" ref={containerRef}>
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
      <Input
        type="text"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          if (e.target.value) setShowOptions(true);
        }}
        placeholder={placeholder}
        className={`pl-10 ${className}`}
        onFocus={() => value && setShowOptions(true)}
      />
      
      {isLoading && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      
      {showOptions && filteredOptions.length > 0 && (
        <div className="absolute z-20 w-full bg-white mt-1 rounded-md border border-gray-200 shadow-md max-h-60 overflow-auto">
          {filteredOptions.map((option) => (
            <div
              key={option.id}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                if (onOptionSelect) {
                  onOptionSelect(option);
                }
                onChange(option.name);
                setShowOptions(false);
              }}
            >
              {option.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchInput;
