
import { Link } from 'react-router-dom';

// Using the uploaded logo
const logoPath = "/lovable-uploads/03fec107-9aab-4acc-bf64-9241c01fb5b5.png";

const Footer = () => {
  return (
    <footer className="bg-gray-50 py-16">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="flex items-center gap-2">
              <img src={logoPath} alt="AlumniSights Logo" className="h-8" />
            </Link>
            <p className="mt-4 text-gray-600">
              Connecting prospective students with authentic insights from 
              current students and alumni.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg mb-4">For Prospective Students</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/browse" className="text-gray-600 hover:text-navy">
                  Browse Profiles
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="text-gray-600 hover:text-navy">
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="/testimonials" className="text-gray-600 hover:text-navy">
                  Testimonials
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-600 hover:text-navy">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg mb-4">For Students & Alumni</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/become-mentor" className="text-gray-600 hover:text-navy">
                  Become a Mentor
                </Link>
              </li>
              <li>
                <Link to="/resources" className="text-gray-600 hover:text-navy">
                  Resources
                </Link>
              </li>
              <li>
                <Link to="/success-stories" className="text-gray-600 hover:text-navy">
                  Success Stories
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-gray-600 hover:text-navy">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-600 hover:text-navy">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/careers" className="text-gray-600 hover:text-navy">
                  Careers
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-600 hover:text-navy">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} AlumniSights. All rights reserved.
          </p>
          
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/privacy" className="text-gray-500 text-sm hover:text-navy">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-gray-500 text-sm hover:text-navy">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
