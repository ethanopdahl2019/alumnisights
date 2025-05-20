
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { OnboardingStepProps } from '@/types/onboarding';
import { Upload, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

const AvatarStep = ({ onNext, onBack, initialData }: OnboardingStepProps) => {
  const [image, setImage] = useState<string | null>(initialData?.image || null);
  const [uploading, setUploading] = useState(false);
  
  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) {
      return;
    }
    
    const file = event.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `avatars/${fileName}`;
    
    setUploading(true);
    try {
      // Upload the file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);
      
      if (uploadError) {
        throw uploadError;
      }
      
      // Get public URL for the uploaded file
      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);
      
      setImage(data.publicUrl);
      toast({
        title: "Success!",
        description: "Your profile image has been uploaded.",
      });
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message || "There was an error uploading your image.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };
  
  const handleNext = () => {
    onNext({ image });
  };
  
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-medium mb-2">Add a Profile Picture</h3>
        <p className="text-gray-500 text-sm">
          Upload a photo to personalize your profile and make it easier for students to connect with you.
        </p>
      </div>
      
      <div className="flex justify-center">
        <div className="relative">
          <Avatar className="h-32 w-32 border-2 border-gray-200">
            <AvatarImage src={image || undefined} />
            <AvatarFallback className="bg-gray-100">
              <User className="h-12 w-12 text-gray-400" />
            </AvatarFallback>
          </Avatar>
          
          <label
            htmlFor="avatar-upload"
            className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-md cursor-pointer hover:bg-gray-100 border border-gray-200"
          >
            <Upload className="h-4 w-4" />
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={handleImageChange}
              disabled={uploading}
            />
          </label>
        </div>
      </div>
      
      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onBack} disabled={uploading}>
          Back
        </Button>
        <Button onClick={handleNext} disabled={uploading}>
          {uploading ? "Uploading..." : "Continue"}
        </Button>
      </div>
    </div>
  );
};

export default AvatarStep;
