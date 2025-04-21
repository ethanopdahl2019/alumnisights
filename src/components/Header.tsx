
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const navLinks = [
  { name: "Browse", path: "/browse" },
  { name: "Schools", path: "/schools" },
  { name: "Insights", path: "/blog" },
];

const Header = () => {
  const { user } = useAuth();
  const location = useLocation();

  return (
    <header className="w-full border-b border-gray-100 bg-white">
      <div className="container-custom py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img
            src="/lovable-uploads/361f7f43-7534-4995-b459-bd081d502881.png"
            alt="AlumniSights Logo"
            className="h-9 w-auto"
          />
        </Link>
        <nav className="flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-base font-medium transition-colors ${
                location.pathname.startsWith(link.path)
                  ? "text-navy"
                  : "text-gray-600 hover:text-navy"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>
        <div>
          {user ? (
            <Link
              to="/profile"
              className="flex items-center gap-2 hover:bg-gray-50 px-3 py-1 rounded"
              title={user.email ?? "Profile"}
            >
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={user.user_metadata?.avatar_url ?? ""}
                  alt={user.user_metadata?.full_name ?? user.email ?? "User"}
                />
                <AvatarFallback>
                  {(user.user_metadata?.full_name ??
                    user.email ??
                    "U"
                  )[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm hidden md:block font-medium text-gray-800">
                {user.user_metadata?.full_name ?? user.email}
              </span>
            </Link>
          ) : (
            <Link
              to="/auth"
              className="inline-block px-5 py-2 border border-navy rounded-lg text-navy hover:bg-navy hover:text-white transition"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
