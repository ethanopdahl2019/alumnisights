
import React from "react";
import { Shield } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface AccessDeniedProps {
  message?: string;
}

const AccessDenied: React.FC<AccessDeniedProps> = ({ message = "You don't have permission to access this page" }) => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main className="container-custom py-20">
        <div className="max-w-md mx-auto text-center">
          <Shield className="h-16 w-16 text-red-500 mx-auto mb-4" />
          
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          
          <p className="text-gray-600 mb-8">
            {message}
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/">
              <Button>
                Return Home
              </Button>
            </Link>
            
            <Link to="/auth">
              <Button variant="outline">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AccessDenied;
