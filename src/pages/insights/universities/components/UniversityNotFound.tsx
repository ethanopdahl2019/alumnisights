
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const UniversityNotFound: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center">
      <p className="text-xl">University not found</p>
      <Button 
        onClick={() => navigate("/insights/undergraduate-admissions")}
        className="mt-4"
        variant="outline"
      >
        Back to Universities
      </Button>
    </div>
  );
};

export default UniversityNotFound;
