
import { Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { MobileMenu } from "@/components/navbar/MobileMenu";
import { DesktopNavLinks } from "@/components/navbar/DesktopNavLinks";

const logoPath = "/lovable-uploads/fac2fbdd-e38c-4d44-a6ff-a1e179fd7a57.png";

const Navbar = () => {
  const isMobile = useIsMobile();

  return (
    <nav className="py-5 border-b border-gray-100 bg-white/80 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
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
