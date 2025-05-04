
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { saveUniversityContent, getUniversityContent } from "@/services/landing-page";
import { useEffect } from "react";

interface UniversityContentFormValues {
  name: string;
  overview: string;
  admissionStats: string;
  applicationRequirements: string;
  alumniInsights: string;
}

interface UseUniversityContentFormProps {
  id?: string;
  universityName?: string;
}

export function useUniversityContentForm({ id, universityName }: UseUniversityContentFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const navigate = useNavigate();

  const form = useForm<UniversityContentFormValues>({
    defaultValues: {
      name: universityName || '',
      overview: '',
      admissionStats: '',
      applicationRequirements: '',
      alumniInsights: '',
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
            alumniInsights: content.alumni_insights || ''
          });
          
          if (content.image) {
            setImagePreview(content.image);
          }
        }
      } catch (error) {
        console.error("Error loading university content:", error);
        toast.error("Failed to load university content");
      }
    };
    
    loadContent();
  }, [id, form]);
  
  const resetImage = () => {
    setImageFile(null);
    setImagePreview(null);
    
    // Clear file input if it exists
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Verify file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }
      
      setImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Function to upload image to Supabase storage
  const uploadImage = async (): Promise<string | null> => {
    if (!imageFile) {
      return null;
    }

    try {
      console.log("Starting image upload...");
      
      // Check if user is authenticated
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        console.error("No active session found");
        throw new Error("Authentication required for file upload");
      }
      
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${id || 'new'}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `university-images/${fileName}`;

      console.log("Uploading to path:", filePath);

      // Upload the file
      const { error: uploadError, data } = await supabase.storage
        .from('university-content')
        .upload(filePath, imageFile, {
          cacheControl: '3600',
          upsert: true
        });
      
      if (uploadError) {
        console.error("Upload error:", uploadError);
        throw uploadError;
      }
      
      console.log("Upload successful:", data);
      
      // Get the public URL for the uploaded file
      const { data: urlData } = supabase.storage
        .from('university-content')
        .getPublicUrl(filePath);
      
      console.log("Public URL generated:", urlData.publicUrl);
      
      return urlData.publicUrl;
    } catch (error: any) {
      console.error("Error uploading image:", error);
      let message = "Failed to upload image";
      
      if (error.message) {
        message += ": " + error.message;
      }
      
      toast.error(message);
      return null;
    }
  };
  
  const onSubmit = async (values: UniversityContentFormValues) => {
    if (!id) {
      toast.error("University ID is required");
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Upload image if provided
      let finalImageUrl = imagePreview;
      
      if (imageFile) {
        finalImageUrl = await uploadImage();
        if (!finalImageUrl) {
          toast.error("Failed to upload image, continuing with content save");
        }
      }
      
      // Save university content
      await saveUniversityContent(id, {
        name: values.name,
        overview: values.overview,
        admissionStats: values.admissionStats,
        applicationRequirements: values.applicationRequirements,
        alumniInsights: values.alumniInsights,
        image: finalImageUrl
      });
      
      toast.success("University content saved successfully");
      navigate(`/insights/universities/${id}`);
      
    } catch (error) {
      console.error("Error saving university content:", error);
      toast.error("Failed to save university content");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    form,
    isLoading,
    imagePreview,
    handleImageChange,
    onSubmit,
    resetImage
  };
}
