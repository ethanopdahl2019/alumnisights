
import { Link } from "react-router-dom";
import { InsightsDropdown } from "./InsightsDropdown";
import { NavbarUserSection } from "./NavbarUserSection";

export const DesktopNavLinks = () => {
  return (
    <div className="flex items-center gap-8">
      <Link to="/browse" className="text-navy font-medium hover:text-primary transition-colors">
        Browse
      </Link>
      <Link to="/schools" className="text-navy font-medium hover:text-primary transition-colors">
        Schools
      </Link>
      
      {/* Desktop Insights Dropdown */}
      <InsightsDropdown />
      
      <NavbarUserSection />
    </div>
  );
};
