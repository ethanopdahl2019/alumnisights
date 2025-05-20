
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { upload } from '@/utils/fileUpload';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface ProfileBasicInfoProps {
  profileData: {
    name: string;
    headline: string;
    location: string;
    bio: string;
    image: File | null;
  };
  updateProfileData: (data: Partial<ProfileBasicInfoProps['profileData']>) => void;
  onNext: () => void;
}

const ProfileBasicInfo: React.FC<ProfileBasicInfoProps> = ({
  profileData,
  updateProfileData,
  onNext,
}) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isValid, setIsValid] = useState(true);
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      updateProfileData({ image: file });
      // Create a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!profileData.name) {
      setIsValid(false);
      return;
    }
    
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex flex-col items-center mb-6">
        <Avatar className="h-24 w-24 mb-4">
          {imagePreview ? (
            <AvatarImage src={imagePreview} alt="Profile picture" />
          ) : (
            <AvatarFallback className="text-2xl bg-blue-100 text-blue-600">
              {profileData.name.charAt(0).toUpperCase() || "A"}
            </AvatarFallback>
          )}
        </Avatar>
        
        <Label htmlFor="profile-image" className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
          Upload Photo
        </Label>
        <Input 
          id="profile-image" 
          type="file" 
          accept="image/*" 
          className="hidden" 
          onChange={handleImageChange}
        />
      </div>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name *</Label>
          <Input
            id="name"
            value={profileData.name}
            onChange={(e) => updateProfileData({ name: e.target.value })}
            placeholder="Your full name"
            required
            className={!isValid && !profileData.name ? "border-red-500" : ""}
          />
          {!isValid && !profileData.name && (
            <p className="text-red-500 text-sm">Name is required</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="headline">Headline</Label>
          <Input
            id="headline"
            value={profileData.headline}
            onChange={(e) => updateProfileData({ headline: e.target.value })}
            placeholder="e.g., Computer Science Graduate | Software Developer"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            value={profileData.location}
            onChange={(e) => updateProfileData({ location: e.target.value })}
            placeholder="e.g., New York, NY"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            value={profileData.bio}
            onChange={(e) => updateProfileData({ bio: e.target.value })}
            placeholder="Tell us about yourself and how you can help students"
            rows={4}
          />
        </div>
      </div>
      
      <div className="pt-4 flex justify-end">
        <Button type="submit">
          Next
        </Button>
      </div>
    </form>
  );
};

export default ProfileBasicInfo;
