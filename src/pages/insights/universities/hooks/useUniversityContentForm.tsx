
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { getUniversityContent, saveUniversityContent } from "@/services/landing-pages";
import { supabase } from "@/integrations/supabase/client";
import type { UniversityContent } from "@/types/database";

// Define form schema for university content
const formSchema = z.object({
  name: z.string().min(1, "University name is required"),
  overview: z.string().min(1, "Overview is required"),
  admissionStats: z.string().min(1, "Admission statistics are required"),
  applicationRequirements: z.string().min(1, "Application requirements are required"),
  alumniInsights: z.string().optional(),
});

export type UniversityFormValues = z.infer<typeof formSchema>;

interface UseUniversityContentFormProps {
  id?: string;
  universityName?: string;
}

export const useUniversityContentForm = ({ id, universityName }: UseUniversityContentFormProps) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingContent, setIsLoadingContent] = useState(!!id);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const form = useForm<UniversityFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: universityName || "",
      overview: "",
      admissionStats: "",
      applicationRequirements: "",
      alumniInsights: "",
    },
  });

  // Load existing university content
  useEffect(() => {
    if (id) {
      const loadUniversityContent = async () => {
        setIsLoadingContent(true);
        try {
          const content = await getUniversityContent(id);
          
          if (content) {
            // Populate the form with existing data
            form.reset({
              name: content.name || universityName || "",
              overview: content.overview || "",
              admissionStats: content.admission_stats || "",
              applicationRequirements: content.application_requirements || "",
              alumniInsights: content.alumni_insights || "",
            });
            
            // Set the image URL if it exists
            if (content.image) {
              setImageUrl(content.image);
              setImagePreview(content.image);
            }
          }
        } catch (error) {
          console.error("Error loading university content:", error);
          toast.error("Failed to load university content");
        } finally {
          setIsLoadingContent(false);
        }
      };
      
      loadUniversityContent();
    } else {
      setIsLoadingContent(false);
    }
  }, [id, form, universityName]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (): Promise<string | null> => {
    if (!imageFile) return imageUrl; // Return existing URL if no new file

    try {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${id || 'new'}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `university-images/${fileName}`;

      // Upload the file
      const { error: uploadError, data } = await supabase.storage
        .from('university-content')
        .upload(filePath, imageFile, {
          upsert: true
        });

      if (uploadError) {
        console.error("Upload error:", uploadError);
        throw uploadError;
      }

      // Get the public URL
      const { data: urlData } = supabase.storage
        .from('university-content')
        .getPublicUrl(filePath);

      return urlData.publicUrl;
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image");
      return null;
    }
  };

  const onSubmit = async (values: UniversityFormValues) => {
    if (!id) {
      toast.error("University ID is required for saving content");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // First upload image if there's a new one
      let finalImageUrl = imageUrl;
      
      if (imageFile) {
        finalImageUrl = await uploadImage();
      }
      
      console.log("Saving university content with image URL:", finalImageUrl);
      
      // Save university content
      await saveUniversityContent(id, {
        name: values.name,
        overview: values.overview,
        admissionStats: values.admissionStats,
        applicationRequirements: values.applicationRequirements,
        alumniInsights: values.alumniInsights || "",
        image: finalImageUrl,
      });

      toast.success("University content updated successfully");
      navigate(`/insights/universities/${id}`);
    } catch (error: any) {
      console.error("Error saving university content:", error);
      toast.error(error?.message || "Failed to save university content");
    } finally {
      setIsLoading(false);
    }
  };
  
  const resetImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setImageUrl(null);
  };

  return {
    form,
    isLoading,
    isLoadingContent,
    imagePreview,
    handleImageChange,
    onSubmit,
    resetImage
  };
};
