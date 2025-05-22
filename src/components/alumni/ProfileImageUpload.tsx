
import React, { useState } from 'react';
import { Upload } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface ProfileImageUploadProps {
  imagePreview: string | null;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ProfileImageUpload: React.FC<ProfileImageUploadProps> = ({
  imagePreview,
  handleImageUpload
}) => {
  return (
    <div className="flex flex-col items-center mb-6">
      <div className="relative cursor-pointer">
        <Avatar className="w-24 h-24">
          {imagePreview ? (
            <AvatarImage src={imagePreview} alt="Profile preview" />
          ) : (
            <AvatarFallback className="bg-muted flex items-center justify-center">
              <Upload className="h-8 w-8 text-muted-foreground" />
            </AvatarFallback>
          )}
        </Avatar>
        <input
          type="file"
          id="profile-image"
          accept="image/*"
          onChange={handleImageUpload}
          className="absolute inset-0 opacity-0 cursor-pointer"
        />
      </div>
      <p className="text-xs text-gray-500 mt-2">Click to upload your profile picture</p>
    </div>
  );
};

export default ProfileImageUpload;
