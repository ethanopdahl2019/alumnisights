
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
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
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
          
          if (content.logo) {
            setLogoPreview(content.logo);
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
    const fileInput = document.querySelector('input[type="file"][id="image-upload"]') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };
  
  const resetLogo = () => {
    setLogoFile(null);
    setLogoPreview(null);
    
    // Clear file input if it exists
    const fileInput = document.querySelector('input[type="file"][id="logo-upload"]') as HTMLInputElement;
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
  
  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Verify file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Logo size should be less than 5MB");
        return;
      }
      
      setLogoFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Function to upload image to Supabase storage
  const uploadFile = async (file: File | null, prefix: string): Promise<string | null> => {
    if (!file) {
      return null;
    }

    try {
      console.log(`Starting ${prefix} upload...`);
      
      // Generate a unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${id || 'new'}-${prefix}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `university-images/${fileName}`;

      console.log("Uploading to path:", filePath);

      // Upload the file
      const { error: uploadError, data } = await supabase.storage
        .from('university-content')
        .upload(filePath, file, {
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
      console.error(`Error uploading ${prefix}:`, error);
      let message = `Failed to upload ${prefix}`;
      
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
      toast.info("Processing your request...");
      
      // Upload image and logo if provided
      let finalImageUrl = imagePreview;
      let finalLogoUrl = logoPreview;
      
      if (imageFile) {
        finalImageUrl = await uploadFile(imageFile, 'image');
        if (!finalImageUrl) {
          toast.warning("Failed to upload image, continuing with content save");
        }
      }
      
      if (logoFile) {
        finalLogoUrl = await uploadFile(logoFile, 'logo');
        if (!finalLogoUrl) {
          toast.warning("Failed to upload logo, continuing with content save");
        }
      }
      
      // Save university content
      await saveUniversityContent(id, {
        name: values.name,
        overview: values.overview,
        admissionStats: values.admissionStats,
        applicationRequirements: values.applicationRequirements,
        alumniInsights: values.alumniInsights,
        image: finalImageUrl,
        logo: finalLogoUrl
      });
      
      toast.success("University content saved successfully");
      // Redirect to undergraduate admissions page
      navigate("/insights/undergraduate-admissions");
      
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
