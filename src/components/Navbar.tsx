
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, ChevronDown } from 'lucide-react';
import { useAuth } from './AuthProvider';
import { isAdmin } from '@/services/auth';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const showAdminLink = user && isAdmin(user);

  return (
    <header className="bg-white shadow">
      <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <span className="font-bold text-xl text-primary">AdminPortal</span>
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/" className={`text-gray-600 hover:text-primary ${isActive('/') ? 'font-medium text-primary' : ''}`}>
            Home
          </Link>
          
          {showAdminLink && (
            <Link 
              to="/admin-dashboard" 
              className={`text-gray-600 hover:text-primary ${isActive('/admin-dashboard') ? 'font-medium text-primary' : ''}`}
            >
              Admin Dashboard
            </Link>
          )}
          
          {user ? (
            <Link 
              to="/account" 
              className={`text-gray-600 hover:text-primary ${isActive('/account') ? 'font-medium text-primary' : ''}`}
            >
              My Account
            </Link>
          ) : (
            <Button variant="outline" onClick={() => navigate('/auth')}>
              Login
            </Button>
          )}
        </div>
        
        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-gray-500 hover:text-gray-700"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </nav>
      
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="container mx-auto px-4 py-2 space-y-2">
            <Link 
              to="/" 
              className={`block py-2 px-4 rounded ${isActive('/') ? 'bg-gray-100 font-medium' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            
            {showAdminLink && (
              <Link 
                to="/admin-dashboard" 
                className={`block py-2 px-4 rounded ${isActive('/admin-dashboard') ? 'bg-gray-100 font-medium' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Admin Dashboard
              </Link>
            )}
            
            {user ? (
              <Link 
                to="/account" 
                className={`block py-2 px-4 rounded ${isActive('/account') ? 'bg-gray-100 font-medium' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                My Account
              </Link>
            ) : (
              <Link 
                to="/auth" 
                className="block py-2 px-4 rounded" 
                onClick={() => setMobileMenuOpen(false)}
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
