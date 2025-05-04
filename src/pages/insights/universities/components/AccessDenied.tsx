
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShieldAlert } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface AccessDeniedProps {
  message: string;
}

const AccessDenied: React.FC<AccessDeniedProps> = ({ message }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="container-custom py-12">
        <div className="max-w-6xl mx-auto text-center">
          <ShieldAlert className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-navy mb-4">Access Denied</h1>
          <p className="mb-6">{message}</p>
          <Button onClick={() => navigate("/auth")}>
            Go to Sign In
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AccessDenied;
