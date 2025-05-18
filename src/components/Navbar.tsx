
import { Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { MobileMenu } from "@/components/navbar/MobileMenu";
import { DesktopNavLinks } from "@/components/navbar/DesktopNavLinks";

// Using the uploaded logo
const logoPath = "/lovable-uploads/03fec107-9aab-4acc-bf64-9241c01fb5b5.png";

const Navbar = () => {
  const isMobile = useIsMobile();

  return (
    <nav className="py-4 border-b border-gray-100 bg-white sticky top-0 z-50 shadow-sm">
      <div className="container-custom flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img src={logoPath} alt="AlumniSights Logo" className="h-8" />
        </Link>
        
        {isMobile ? <MobileMenu /> : <DesktopNavLinks />}
      </div>
    </nav>
  );
};

export default Navbar;
