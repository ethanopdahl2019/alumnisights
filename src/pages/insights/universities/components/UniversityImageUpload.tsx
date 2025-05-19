
import React from "react";
import { Button } from "@/components/ui/button";
import { FormItem, FormLabel } from "@/components/ui/form";
import { Image, Upload } from "lucide-react";

interface UniversityImageUploadProps {
  initialImage?: string | null;
  onImageUpload: (url: string) => void;
  aspectRatio?: string;
  description?: string;
}

const UniversityImageUpload: React.FC<UniversityImageUploadProps> = ({
  initialImage,
  onImageUpload,
  aspectRatio = "16:9",
  description = "Upload an image"
}) => {
  const [imagePreview, setImagePreview] = React.useState<string | null>(initialImage || null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImagePreview(result);
        onImageUpload(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageRemove = () => {
    setImagePreview(null);
    onImageUpload("");
  };

  return (
    <FormItem>
      <div className="border rounded-md p-2">
        <div className="mb-2">
          {imagePreview ? (
            <div className="relative">
              <img 
                src={imagePreview} 
                alt="Preview" 
                className="w-full h-48 object-cover rounded-md"
                style={{ aspectRatio }}
              />
              <Button 
                type="button" 
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2"
                onClick={handleImageRemove}
              >
                Remove
              </Button>
            </div>
          ) : (
            <div 
              className="w-full h-48 bg-gray-100 flex flex-col items-center justify-center rounded-md"
              style={{ aspectRatio }}
            >
              <Image className="h-8 w-8 text-gray-400 mb-2" />
              <p className="text-sm text-gray-500">No image uploaded</p>
              <p className="text-xs text-gray-400 mt-1">{description}</p>
            </div>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <label 
            htmlFor="image-upload"
            className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload Image
          </label>
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={handleImageChange}
          />
        </div>
      </div>
    </FormItem>
  );
};

export default UniversityImageUpload;
