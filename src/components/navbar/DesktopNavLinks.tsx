
import { Link } from "react-router-dom";
import { InsightsDropdown } from "./InsightsDropdown";
import { NavbarUserSection } from "./NavbarUserSection";

export const DesktopNavLinks = () => {
  return (
    <div className="flex items-center gap-8">
      <Link to="/browse" className="text-navy text-base hover:text-navy/80 transition-colors">
        Browse
      </Link>
      <Link to="/schools" className="text-navy text-base hover:text-navy/80 transition-colors">
        Schools
      </Link>
      
      {/* Desktop Insights Dropdown with consistent text size */}
      <InsightsDropdown />
      
      <NavbarUserSection />
    </div>
  );
};
