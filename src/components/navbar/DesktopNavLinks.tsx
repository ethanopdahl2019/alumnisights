
import { Link } from "react-router-dom";
import { MessageSquare } from "lucide-react";
import { InsightsDropdown } from "./InsightsDropdown";
import { NavbarUserSection } from "./NavbarUserSection";
import { useAuth } from "@/components/AuthProvider";

export const DesktopNavLinks = () => {
  const { user } = useAuth();
  
  return (
    <div className="flex items-center gap-8">
      <Link to="/browse" className="text-navy font-medium hover:text-navy/80 transition-colors">
        Browse
      </Link>
      <Link to="/schools" className="text-navy font-medium hover:text-navy/80 transition-colors">
        Schools
      </Link>
      
      {/* Messaging link for logged in users */}
      {user && (
        <Link to="/messaging" className="text-navy font-medium hover:text-navy/80 transition-colors flex items-center gap-1">
          <MessageSquare size={18} />
          Messages
        </Link>
      )}
      
      {/* Desktop Insights Dropdown */}
      <InsightsDropdown />
      
      <NavbarUserSection />
    </div>
  );
};
