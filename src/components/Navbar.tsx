
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="py-6 border-b border-gray-100">
      <div className="container-custom flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-navy">
          AlumniSights
        </Link>
        
        <div className="hidden md:flex items-center space-x-10">
          <Link to="/browse" className="nav-link">
            Browse Profiles
          </Link>
          <Link to="/how-it-works" className="nav-link">
            How It Works
          </Link>
          <Link to="/blog" className="nav-link">
            Insights
          </Link>
        </div>
        
        <div className="flex items-center space-x-6">
          <div className="relative hidden md:block">
            <input 
              type="text" 
              placeholder="Search..." 
              className="pl-10 pr-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:border-navy"
            />
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          
          <Link to="/sign-in" className="text-navy hover:text-navy/80">
            Sign In
          </Link>
          
          <Link to="/sign-up" className="btn-primary">
            Join
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
