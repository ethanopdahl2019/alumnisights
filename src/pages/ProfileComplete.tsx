
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/components/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { uploadFile } from '@/utils/fileUpload';

const ProfileComplete = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [formData, setFormData] = useState({
    image: '',
    bio: '',
    price_15_min: '',
    price_30_min: '',
    price_60_min: '',
  });

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    // Fetch existing profile data
    const fetchProfile = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (data) {
        setProfile(data);
        setFormData({
          image: data.image || '',
          bio: data.bio || '',
          price_15_min: data.price_15_min?.toString() || '',
          price_30_min: data.price_30_min?.toString() || '',
          price_60_min: data.price_60_min?.toString() || '',
        });
      }
    };

    fetchProfile();
  }, [user, navigate]);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setLoading(true);
      const imageUrl = await uploadFile(file, 'profile-images');
      setFormData(prev => ({ ...prev, image: imageUrl }));
      toast({
        title: "Image uploaded successfully",
        description: "Your profile image has been updated.",
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !profile) return;

    setLoading(true);
    try {
      const updateData: any = {
        image: formData.image,
        bio: formData.bio,
      };

      // Only add pricing fields for mentors
      if (profile.role === 'mentor') {
        updateData.price_15_min = formData.price_15_min ? parseInt(formData.price_15_min) : null;
        updateData.price_30_min = formData.price_30_min ? parseInt(formData.price_30_min) : null;
        updateData.price_60_min = formData.price_60_min ? parseInt(formData.price_60_min) : null;
      }

      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: "Profile updated",
        description: "Your profile has been completed successfully.",
      });

      // Redirect based on user role
      if (profile.role === 'mentor') {
        navigate('/mentor-dashboard');
      } else {
        navigate('/student-dashboard');
      }
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({
        title: "Update failed",
        description: error.message || "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Complete Your Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Profile Image Upload */}
              <div className="space-y-2">
                <Label htmlFor="image">Profile Photo</Label>
                <div className="flex flex-col items-center space-y-4">
                  {formData.image && (
                    <img 
                      src={formData.image} 
                      alt="Profile preview" 
                      className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                    />
                  )}
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Bio */}
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  placeholder="Tell us about yourself..."
                  value={formData.bio}
                  onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                  rows={4}
                />
              </div>

              {/* Pricing (only for mentors) */}
              {profile.role === 'mentor' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Session Pricing</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="price_15_min">15-minute session ($)</Label>
                      <Input
                        id="price_15_min"
                        type="number"
                        placeholder="25"
                        value={formData.price_15_min}
                        onChange={(e) => setFormData(prev => ({ ...prev, price_15_min: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="price_30_min">30-minute session ($)</Label>
                      <Input
                        id="price_30_min"
                        type="number"
                        placeholder="45"
                        value={formData.price_30_min}
                        onChange={(e) => setFormData(prev => ({ ...prev, price_30_min: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="price_60_min">60-minute session ($)</Label>
                      <Input
                        id="price_60_min"
                        type="number"
                        placeholder="80"
                        value={formData.price_60_min}
                        onChange={(e) => setFormData(prev => ({ ...prev, price_60_min: e.target.value }))}
                      />
                    </div>
                  </div>
                </div>
              )}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Saving...' : 'Complete Profile'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfileComplete;
