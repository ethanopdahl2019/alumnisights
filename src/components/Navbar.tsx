
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

// Path to logo image
const logoPath = "/lovable-uploads/bdaaf67c-3436-4d56-bf80-25d5b4978254.png";

const Navbar = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="py-4 border-b border-gray-100 bg-white">
      <div className="container-custom flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img src={logoPath} alt="AlumniSights Logo" className="h-10" />
        </Link>
        <div className="flex items-center gap-6">
          <Link to="/browse" className="text-navy font-medium hover:text-navy/80">
            Browse
          </Link>
          <Link to="/schools" className="text-navy font-medium hover:text-navy/80">
            Schools
          </Link>
          <Link to="/blog" className="text-navy font-medium hover:text-navy/80">
            Insights
          </Link>
          {!user ? (
            <Link to="/auth" className="ml-2 px-4 py-2 rounded-full text-white bg-navy hover:bg-navy/90 font-medium transition-colors">
              Sign In
            </Link>
          ) : (
            <button
              onClick={() => navigate("/profile/" + (user.id || ""))}
              className="flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 hover:bg-gray-200"
              title={user.email}
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.user_metadata?.avatar_url} alt={user.email || "profile"} />
                <AvatarFallback>{(user.user_metadata?.first_name?.[0] || user.email?.[0] || "U").toUpperCase()}</AvatarFallback>
              </Avatar>
              <span className="hidden md:inline text-sm font-medium text-navy">{user.user_metadata?.first_name || user.email}</span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
