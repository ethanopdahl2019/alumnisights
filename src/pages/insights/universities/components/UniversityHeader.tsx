
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface UniversityHeaderProps {
  title: string;
}

const UniversityHeader: React.FC<UniversityHeaderProps> = ({ title }) => {
  const navigate = useNavigate();
  
  return (
    <div className="mb-8">
      <Button 
        onClick={() => navigate("/insights/undergraduate-admissions")}
        variant="ghost" 
        className="mb-4 pl-0 hover:bg-transparent"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Universities
      </Button>
      
      <h1 className="text-3xl md:text-4xl font-bold text-navy mb-6">
        {title}
      </h1>
      <div className="w-20 h-1 bg-blue-600 rounded-full mb-8"></div>
    </div>
  );
};

export default UniversityHeader;
