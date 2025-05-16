
import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { insightsItems } from "./InsightsDropdown";
import { NavbarUserSection } from "./NavbarUserSection";

export const MobileMenu = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  return (
    <>
      <button 
        onClick={toggleMobileMenu}
        className="p-2 text-navy hover:bg-gray-100 rounded-md"
        aria-label="Toggle menu"
      >
        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
      
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-white border-b border-gray-200 py-4 shadow-md">
          <div className="container-custom flex flex-col space-y-4">
            <Link 
              to="/browse" 
              className="text-navy font-medium py-2 hover:bg-gray-50 px-4 rounded text-sm"
              onClick={() => setMobileMenuOpen(false)}
            >
              Browse
            </Link>
            <Link 
              to="/schools" 
              className="text-navy font-medium py-2 hover:bg-gray-50 px-4 rounded text-sm"
              onClick={() => setMobileMenuOpen(false)}
            >
              Schools
            </Link>
            
            {/* Mobile Insights Dropdown */}
            <div className="flex flex-col gap-2">
              <div className="text-navy font-medium py-2 px-4 text-sm">
                Insights
              </div>
              <div className="pl-4 flex flex-col gap-1">
                {insightsItems.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    className="text-navy py-2 px-4 hover:bg-gray-50 rounded text-sm"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.title}
                  </Link>
                ))}
              </div>
            </div>
            
            <div className="px-4">
              <NavbarUserSection />
            </div>
          </div>
        </div>
      )}
    </>
  );
};
