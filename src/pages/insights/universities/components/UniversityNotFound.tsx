
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";

const UniversityNotFound: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleBack = () => {
    if (location.pathname.includes('/schools/')) {
      navigate("/schools/undergraduate-admissions");
    } else {
      navigate("/insights/undergraduate-admissions");
    }
  };
  
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center">
      <p className="text-xl">University not found</p>
      <Button 
        onClick={handleBack}
        className="mt-4"
        variant="outline"
      >
        Back to Universities
      </Button>
    </div>
  );
};

export default UniversityNotFound;
