
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  // Check if the path was related to university content editing
  const isUniversityPath = location.pathname.includes('university-content');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full text-center">
        <h1 className="text-4xl font-bold mb-4 text-red-600">404</h1>
        <p className="text-xl text-gray-600 mb-6">Oops! Page not found</p>
        
        <p className="text-gray-500 mb-6">
          The page you are looking for might have been removed or is temporarily unavailable.
        </p>
        
        <div className="space-y-3">
          {isUniversityPath && (
            <Button asChild className="block w-full">
              <Link to="/insights/university-content-manager">
                Return to University Content Manager
              </Link>
            </Button>
          )}
          
          <Button asChild variant="outline" className="block w-full">
            <Link to="/">
              Return to Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
