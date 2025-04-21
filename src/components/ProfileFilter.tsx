
import { useState } from 'react';
import { ChevronDown, ChevronUp, Filter } from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

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
  const [expandedCategories, setExpandedCategories] = useState<string[]>(
    categories.map(cat => cat.id) // Start with all categories expanded
  );

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

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId) 
        : [...prev, categoryId]
    );
  };

  const isCategoryExpanded = (categoryId: string) => {
    return expandedCategories.includes(categoryId);
  };

  const getActiveCounts = () => {
    return Object.values(activeFilters).reduce((sum, filters) => sum + filters.length, 0);
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
          {getActiveCounts() > 0 && (
            <span className="ml-2 px-2 py-0.5 bg-navy text-white text-xs rounded-full">
              {getActiveCounts()}
            </span>
          )}
        </button>
      </div>
      
      <div className={`${isOpen ? 'block' : 'hidden md:block'}`}>
        {categories.map((category) => (
          <Collapsible 
            key={category.id} 
            className="mb-6 border-b pb-2"
            open={isCategoryExpanded(category.id)}
            onOpenChange={() => toggleCategory(category.id)}
          >
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">{category.name}</h3>
              <CollapsibleTrigger className="p-1 hover:bg-gray-100 rounded">
                {isCategoryExpanded(category.id) ? (
                  <ChevronUp size={18} />
                ) : (
                  <ChevronDown size={18} />
                )}
              </CollapsibleTrigger>
            </div>
            
            <CollapsibleContent>
              <div className="flex flex-wrap gap-2 mt-3">
                {category.options.map((option) => (
                  <button
                    key={option.id}
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                      isFilterActive(category.id, option.id)
                        ? 'bg-navy text-white'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                    onClick={() => toggleFilter(category.id, option.id)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        ))}
        
        {getActiveCounts() > 0 && (
          <button 
            className="text-navy hover:underline text-sm"
            onClick={() => {
              setActiveFilters({});
              categories.forEach(cat => onFilterChange(cat.id, []));
            }}
          >
            Clear all filters
          </button>
        )}
      </div>
    </div>
  );
};

export default ProfileFilter;
