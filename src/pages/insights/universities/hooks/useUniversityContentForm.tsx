
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { saveUniversityContent, getUniversityContent } from "@/services/landing-page";
import { uploadFileToStorage } from "@/utils/fileUpload";
import { useImagePreview } from "./useImagePreview";

interface UniversityContentFormValues {
  name: string;
  overview: string;
  admissionStats: string;
  applicationRequirements: string;
  alumniInsights: string;
  didYouKnow: string;
}

interface UseUniversityContentFormProps {
  id?: string;
  universityName?: string;
  initialImage?: string;
  initialLogo?: string;
}

export function useUniversityContentForm({ 
  id, 
  universityName, 
  initialImage, 
  initialLogo 
}: UseUniversityContentFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Use our new image preview hooks
  const {
    file: imageFile,
    preview: imagePreview,
    resetImage: resetImage,
    handleImageChange: handleImageChange
  } = useImagePreview({
    initialUrl: initialImage,
    fieldId: "image-upload"
  });

  const {
    file: logoFile,
    preview: logoPreview,
    resetImage: resetLogo,
    handleImageChange: handleLogoChange
  } = useImagePreview({
    initialUrl: initialLogo,
    fieldId: "logo-upload"
  });
  
  // Set up the form
  const form = useForm<UniversityContentFormValues>({
    defaultValues: {
      name: universityName || '',
      overview: '',
      admissionStats: '',
      applicationRequirements: '',
      alumniInsights: '',
      didYouKnow: '',
    }
  });

  // Load existing content if editing
  useEffect(() => {
    const loadContent = async () => {
      if (!id) return;
      
      try {
        const content = await getUniversityContent(id);
        if (content) {
          form.reset({
            name: content.name,
            overview: content.overview || '',
            admissionStats: content.admission_stats || '',
            applicationRequirements: content.application_requirements || '',
            alumniInsights: content.alumni_insights || '',
            didYouKnow: content.did_you_know || '',
          });
        }
      } catch (error) {
        console.error("Error loading university content:", error);
        toast.error("Failed to load university content");
      }
    };
    
    loadContent();
  }, [id, form]);

  const onSubmit = async (values: UniversityContentFormValues) => {
    if (!id) {
      toast.error("University ID is required");
      return;
    }
    
    try {
      setIsLoading(true);
      toast.info("Processing your request...");
      
      console.log("Current image state:", {
        imageFile: imageFile ? imageFile.name : "none",
        logoFile: logoFile ? logoFile.name : "none",
        imagePreview,
        logoPreview
      });
      
      // Upload image and logo if provided
      let finalImageUrl = imagePreview;
      let finalLogoUrl = logoPreview;
      
      if (imageFile) {
        const uploadedImageUrl = await uploadFileToStorage({ 
          file: imageFile, 
          prefix: 'hero', 
          resourceId: id 
        });
        
        if (uploadedImageUrl) {
          finalImageUrl = uploadedImageUrl;
          console.log("Successfully uploaded hero image:", finalImageUrl);
        } else {
          console.warn("Failed to upload hero image, keeping existing URL if available");
          toast.warning("Failed to upload hero image, continuing with content save");
        }
      }
      
      if (logoFile) {
        const uploadedLogoUrl = await uploadFileToStorage({ 
          file: logoFile, 
          prefix: 'logo', 
          resourceId: id 
        });
        
        if (uploadedLogoUrl) {
          finalLogoUrl = uploadedLogoUrl;
          console.log("Successfully uploaded logo:", finalLogoUrl);
        } else {
          console.warn("Failed to upload logo, keeping existing URL if available");
          toast.warning("Failed to upload logo, continuing with content save");
        }
      }
      
      console.log("Final image URLs:", { finalImageUrl, finalLogoUrl });
      
      // Save university content
      await saveUniversityContent(id, {
        name: values.name,
        overview: values.overview,
        admissionStats: values.admissionStats,
        applicationRequirements: values.applicationRequirements,
        alumniInsights: values.alumniInsights,
        didYouKnow: values.didYouKnow,
        image: finalImageUrl,
        logo: finalLogoUrl
      });
      
      toast.success("University content saved successfully");
      
      // Redirect back to the editor page for this university
      navigate(`/insights/university-content-editor/${id}`);
      
    } catch (error: any) {
      console.error("Error saving university content:", error);
      toast.error(`Failed to save university content: ${error.message || 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    form,
    isLoading,
    imagePreview,
    logoPreview,
    handleImageChange,
    handleLogoChange,
    onSubmit,
    resetImage,
    resetLogo
  };
}
