
import { useState, useEffect } from "react";
import { toast } from "sonner";

interface UseImagePreviewOptions {
  initialUrl?: string | null;
  fieldId?: string;
  maxSizeMB?: number;
}

export function useImagePreview({
  initialUrl = null,
  fieldId = "image-upload",
  maxSizeMB = 5
}: UseImagePreviewOptions = {}) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(initialUrl);
  
  // Update preview when initialUrl changes
  useEffect(() => {
    if (initialUrl && !preview) {
      setPreview(initialUrl);
    }
  }, [initialUrl, preview]);
  
  const resetImage = () => {
    setFile(null);
    setPreview(null);
    
    // Clear file input if it exists
    const fileInput = document.querySelector(`input[type="file"][id="${fieldId}"]`) as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      // Verify file size
      if (selectedFile.size > maxSizeMB * 1024 * 1024) {
        toast.error(`Image size should be less than ${maxSizeMB}MB`);
        return;
      }
      
      setFile(selectedFile);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };
  
  return {
    file,
    preview,
    resetImage,
    handleImageChange
  };
}
