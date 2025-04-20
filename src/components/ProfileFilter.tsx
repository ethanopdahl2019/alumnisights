
import { useState } from 'react';
import { Filter } from 'lucide-react';

interface FilterOption {
  id: string;
  label: string;
}

interface FilterCategory {
  id: string;
  name: string;
  options: FilterOption[];
}

interface ProfileFilterProps {
  categories: FilterCategory[];
  onFilterChange: (categoryId: string, selectedIds: string[]) => void;
}

const ProfileFilter = ({ categories, onFilterChange }: ProfileFilterProps) => {
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});
  const [isOpen, setIsOpen] = useState(false);

  const toggleFilter = (categoryId: string, optionId: string) => {
    setActiveFilters((prev) => {
      const currentSelected = prev[categoryId] || [];
      const newSelected = currentSelected.includes(optionId)
        ? currentSelected.filter((id) => id !== optionId)
        : [...currentSelected, optionId];
      
      const result = {
        ...prev,
        [categoryId]: newSelected,
      };
      
      onFilterChange(categoryId, newSelected);
      return result;
    });
  };

  const isFilterActive = (categoryId: string, optionId: string) => {
    return (activeFilters[categoryId] || []).includes(optionId);
  };

  const toggleMobileFilters = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-medium">Filters</h2>
        
        <button 
          className="flex items-center text-navy md:hidden"
          onClick={toggleMobileFilters}
        >
          <Filter size={20} className="mr-2" />
          <span>Filters</span>
        </button>
      </div>
      
      <div className={`${isOpen ? 'block' : 'hidden md:block'}`}>
        {categories.map((category) => (
          <div key={category.id} className="mb-6">
            <h3 className="text-lg font-medium mb-3">{category.name}</h3>
            
            <div className="flex flex-wrap gap-2">
              {category.options.map((option) => (
                <button
                  key={option.id}
                  className={`filter-pill ${
                    isFilterActive(category.id, option.id) ? 'filter-pill-active' : ''
                  }`}
                  onClick={() => toggleFilter(category.id, option.id)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfileFilter;
