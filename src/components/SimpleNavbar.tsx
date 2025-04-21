
import { Link } from "react-router-dom";
import { useState } from "react";
import { Menu } from "lucide-react";
import logo from "/uploaded-logo.png"; // User's uploaded logo

const links = [
  { to: "/browse", label: "Browse" },
  { to: "/schools", label: "Schools" },
  { to: "/blog", label: "Insights" },
];

const SimpleNavbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="w-full z-30 bg-white border-b border-gray-200">
      <div className="container-custom flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="Logo" className="h-8 w-8 object-contain" />
          <span className="text-xl font-semibold text-navy">AlumniSights</span>
        </Link>
        {/* Desktop Nav */}
        <div className="hidden md:flex gap-8 items-center">
          {links.map((link) => (
            <Link key={link.to} to={link.to} className="text-navy hover:text-navy/80 font-medium transition">
              {link.label}
            </Link>
          ))}
          <Link to="/auth" className="text-navy hover:text-navy/80 font-medium transition">
            Auth / Profile
          </Link>
        </div>
        {/* Mobile menu button */}
        <button
          className="md:hidden p-2"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label="Menu"
        >
          <Menu className="h-6 w-6 text-navy" />
        </button>
      </div>
      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 px-6 py-3">
          <div className="flex flex-col gap-4">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-navy font-medium"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/auth"
              className="text-navy font-medium"
              onClick={() => setMenuOpen(false)}
            >
              Auth / Profile
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default SimpleNavbar;
