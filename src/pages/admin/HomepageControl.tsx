
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/components/AuthProvider";
import { toast } from "sonner";
import { Upload, Image, Save, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { isAdmin, refreshAndCheckAdmin } from "@/services/auth";
import AccessDenied from "../insights/universities/components/AccessDenied";

interface HomepageSettings {
  hero_title: string;
  hero_subtitle: string;
  hero_image: string;
  featured_image_1: string;
  featured_image_2: string;
  featured_image_3: string;
}

const HomepageControl = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [isAdminUser, setIsAdminUser] = useState<boolean | null>(null);
  const [checkingAdmin, setCheckingAdmin] = useState<boolean>(true);
  const [settings, setSettings] = useState<HomepageSettings>({
    hero_title: "",
    hero_subtitle: "",
    hero_image: "",
    featured_image_1: "",
    featured_image_2: "",
    featured_image_3: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) {
        setCheckingAdmin(false);
        return;
      }
      
      try {
        const hasAdminRole = await refreshAndCheckAdmin(user);
        setIsAdminUser(hasAdminRole);
        
        if (!hasAdminRole) {
          toast.error("You don't have permission to access this page");
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
        toast.error("Error checking permissions");
      } finally {
        setCheckingAdmin(false);
      }
    };
    
    if (!loading) {
      checkAdminStatus();
    }
  }, [user, loading]);

  useEffect(() => {
    if (isAdminUser) {
      loadSettings();
    }
  }, [isAdminUser]);

  const loadSettings = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('key, value')
        .in('key', [
          'hero_title',
          'hero_subtitle', 
          'hero_image',
          'featured_image_1',
          'featured_image_2',
          'featured_image_3'
        ]);

      if (error) throw error;

      const settingsObj: any = {};
      data?.forEach(setting => {
        settingsObj[setting.key] = setting.value || '';
      });

      setSettings(settingsObj);
    } catch (error) {
      console.error('Error loading settings:', error);
      toast.error('Failed to load homepage settings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (key: keyof HomepageSettings, value: string) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleFileUpload = async (key: keyof HomepageSettings, file: File) => {
    if (!file) return;

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `homepage-${key}-${Date.now()}.${fileExt}`;
      const filePath = `homepage/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('site-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('site-images')
        .getPublicUrl(filePath);

      handleInputChange(key, urlData.publicUrl);
      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    }
  };

  const saveSettings = async () => {
    setIsSaving(true);
    try {
      const updates = Object.entries(settings).map(([key, value]) => ({
        key,
        value,
        updated_at: new Date().toISOString()
      }));

      for (const update of updates) {
        const { error } = await supabase
          .from('site_settings')
          .upsert(update, { onConflict: 'key' });
        
        if (error) throw error;
      }

      toast.success('Homepage settings saved successfully');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading || checkingAdmin) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy mx-auto"></div>
          <p className="mt-4 text-navy">Loading...</p>
        </div>
      </div>
    );
  }
  
  if (!user) {
    return <AccessDenied message="Please sign in to access this page" />;
  }

  if (isAdminUser === false) {
    return <AccessDenied message="You don't have permission to access this page" />;
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="container-custom py-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Button 
              variant="outline" 
              onClick={() => navigate('/admin')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Admin
            </Button>
            <h1 className="text-3xl md:text-4xl font-bold text-navy">
              Homepage Control
            </h1>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy mx-auto"></div>
              <p className="mt-4 text-navy">Loading settings...</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Hero Section */}
              <Card>
                <CardHeader>
                  <CardTitle>Hero Section</CardTitle>
                  <CardDescription>
                    Configure the main hero section content and image
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="hero_title">Hero Title</Label>
                    <Input
                      id="hero_title"
                      value={settings.hero_title}
                      onChange={(e) => handleInputChange('hero_title', e.target.value)}
                      placeholder="Enter hero title"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="hero_subtitle">Hero Subtitle</Label>
                    <Textarea
                      id="hero_subtitle"
                      value={settings.hero_subtitle}
                      onChange={(e) => handleInputChange('hero_subtitle', e.target.value)}
                      placeholder="Enter hero subtitle"
                      rows={3}
                    />
                  </div>
                  
                  <div>
                    <Label>Hero Background Image</Label>
                    <div className="flex items-center gap-4">
                      <Input
                        value={settings.hero_image}
                        onChange={(e) => handleInputChange('hero_image', e.target.value)}
                        placeholder="Image URL"
                        className="flex-1"
                      />
                      <label className="cursor-pointer">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileUpload('hero_image', file);
                          }}
                          className="hidden"
                        />
                        <Button variant="outline" size="sm" className="flex items-center gap-2">
                          <Upload className="h-4 w-4" />
                          Upload
                        </Button>
                      </label>
                    </div>
                    {settings.hero_image && (
                      <img 
                        src={settings.hero_image} 
                        alt="Hero preview" 
                        className="mt-2 h-32 w-full object-cover rounded-md"
                      />
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Featured Images */}
              <Card>
                <CardHeader>
                  <CardTitle>Featured Images</CardTitle>
                  <CardDescription>
                    Configure featured images displayed on the homepage
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {[1, 2, 3].map((num) => {
                    const key = `featured_image_${num}` as keyof HomepageSettings;
                    return (
                      <div key={num}>
                        <Label>Featured Image {num}</Label>
                        <div className="flex items-center gap-4">
                          <Input
                            value={settings[key]}
                            onChange={(e) => handleInputChange(key, e.target.value)}
                            placeholder="Image URL"
                            className="flex-1"
                          />
                          <label className="cursor-pointer">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleFileUpload(key, file);
                              }}
                              className="hidden"
                            />
                            <Button variant="outline" size="sm" className="flex items-center gap-2">
                              <Upload className="h-4 w-4" />
                              Upload
                            </Button>
                          </label>
                        </div>
                        {settings[key] && (
                          <img 
                            src={settings[key]} 
                            alt={`Featured preview ${num}`} 
                            className="mt-2 h-24 w-32 object-cover rounded-md"
                          />
                        )}
                      </div>
                    );
                  })}
                </CardContent>
              </Card>

              {/* Save Button */}
              <div className="flex justify-end">
                <Button 
                  onClick={saveSettings} 
                  disabled={isSaving}
                  className="flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  {isSaving ? 'Saving...' : 'Save Settings'}
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default HomepageControl;
