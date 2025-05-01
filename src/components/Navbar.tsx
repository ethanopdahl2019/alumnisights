
import { Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { MobileMenu } from "@/components/navbar/MobileMenu";
import { DesktopNavLinks } from "@/components/navbar/DesktopNavLinks";

const logoPath = "/lovable-uploads/bdaaf67c-3436-4d56-bf80-25d5b4978254.png";

const Navbar = () => {
  const isMobile = useIsMobile();

  return (
    <nav className="py-3 border-b border-gray-100 bg-white sticky top-0 z-50">
      <div className="container-custom flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img src={logoPath} alt="AlumniSights Logo" className="h-4" />
        </Link>
        
        {isMobile ? <MobileMenu /> : <DesktopNavLinks />}
      </div>
    </nav>
  );
};

export default Navbar;
