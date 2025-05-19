
import { useState } from "react";
import { saveUniversityContent } from "@/services/landing-page";
import { toast } from "sonner";

export const useUniversityContentForm = (universityId: string) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: {
    name: string;
    overview: string;
    admissionStats: string;
    applicationRequirements: string;
    alumniInsights: string;
    didYouKnow: string;
    image?: string | null;
    logo?: string | null;
  }) => {
    setIsSubmitting(true);
    try {
      await saveUniversityContent(universityId, {
        name: data.name,
        overview: data.overview,
        admissionStats: data.admissionStats,
        applicationRequirements: data.applicationRequirements,
        alumniInsights: data.alumniInsights,
        didYouKnow: data.didYouKnow,
        image: data.image,
        logo: data.logo
      });
      
      toast.success("Content saved successfully");
      return true;
    } catch (error) {
      console.error("Error saving content:", error);
      toast.error("Failed to save content");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    handleSubmit,
    isSubmitting
  };
};

export default useUniversityContentForm;
