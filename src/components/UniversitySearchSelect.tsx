
import React, { useState, useEffect } from "react";
import SearchInput from "@/components/SearchInput";
import { getUniversities } from "@/services/universities";

interface University {
  id: string;
  name: string;
  state: string | null;
  type: string | null;
  order_letter: string;
}

interface UniversitySearchSelectProps {
  value: string;
  onSelect: (universityId: string) => void;
  placeholder?: string;
  className?: string;
}

const UniversitySearchSelect = ({ 
  value, 
  onSelect, 
  placeholder = "Type to search universities...",
  className = ""
}: UniversitySearchSelectProps) => {
  const [universities, setUniversities] = useState<University[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUniversity, setSelectedUniversity] = useState<University | null>(null);

  useEffect(() => {
    const loadUniversities = async () => {
      try {
        const data = await getUniversities();
        setUniversities(data);
        
        // Find selected university if value is provided
        if (value) {
          const selected = data.find(uni => uni.id === value);
          if (selected) {
            setSelectedUniversity(selected);
            setSearchTerm(selected.name);
          }
        }
      } catch (error) {
        console.error("Failed to load universities:", error);
      }
    };
    
    loadUniversities();
  }, [value]);

  const handleOptionSelect = (option: { id: string; name: string }) => {
    const university = universities.find(uni => uni.id === option.id);
    if (university) {
      setSelectedUniversity(university);
      setSearchTerm(university.name);
      onSelect(university.id);
    }
  };

  const handleSearchChange = (newSearchTerm: string) => {
    setSearchTerm(newSearchTerm);
    
    // Clear selection if search term doesn't match selected university
    if (selectedUniversity && !selectedUniversity.name.toLowerCase().includes(newSearchTerm.toLowerCase())) {
      setSelectedUniversity(null);
      onSelect("");
    }
  };

  return (
    <SearchInput
      value={searchTerm}
      onChange={handleSearchChange}
      placeholder={placeholder}
      className={className}
      options={universities.map(uni => ({ id: uni.id, name: uni.name }))}
      onOptionSelect={handleOptionSelect}
    />
  );
};

export default UniversitySearchSelect;
