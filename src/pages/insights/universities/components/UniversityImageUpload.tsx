
import React from "react";
import { Button } from "@/components/ui/button";
import { FormItem, FormLabel } from "@/components/ui/form";
import { Image, Upload } from "lucide-react";

interface UniversityImageUploadProps {
  imagePreview: string | null;
  onImageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onImageRemove: () => void;
  id?: string;
  label?: string;
  helpText?: string;
}

const UniversityImageUpload: React.FC<UniversityImageUploadProps> = ({
  imagePreview,
  onImageChange,
  onImageRemove,
  id = "image-upload",
  label = "University Image",
  helpText = "Upload an image"
}) => {
  return (
    <FormItem>
      <FormLabel>{label}</FormLabel>
      <div className="border rounded-md p-2">
        <div className="mb-2">
          {imagePreview ? (
            <div className="relative">
              <img 
                src={imagePreview} 
                alt="Preview" 
                className="w-full h-48 object-cover rounded-md"
              />
              <Button 
                type="button" 
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2"
                onClick={onImageRemove}
              >
                Remove
              </Button>
            </div>
          ) : (
            <div className="w-full h-48 bg-gray-100 flex flex-col items-center justify-center rounded-md">
              <Image className="h-8 w-8 text-gray-400 mb-2" />
              <p className="text-sm text-gray-500">No image uploaded</p>
              <p className="text-xs text-gray-400 mt-1">{helpText}</p>
            </div>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <label 
            htmlFor={id}
            className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload Image
          </label>
          <input
            id={id}
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={onImageChange}
          />
        </div>
      </div>
    </FormItem>
  );
};

export default UniversityImageUpload;
