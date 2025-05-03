
import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { universities } from "./universities-data";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { useAuth } from "@/components/AuthProvider";
import { ShieldAlert, Upload, Image } from "lucide-react";
import { getUniversityContent, saveUniversityContent } from "@/services/landing-pages";
import { supabase } from "@/integrations/supabase/client";

// Define form schema for university content
const formSchema = z.object({
  name: z.string().min(1, "University name is required"),
  overview: z.string().min(1, "Overview is required"),
  admissionStats: z.string().min(1, "Admission statistics are required"),
  applicationRequirements: z.string().min(1, "Application requirements are required"),
  alumniInsights: z.string().optional(),
});

const UniversityContentEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingContent, setIsLoadingContent] = useState(true);
  const { user, loading } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Find university if editing existing one
  const universityData = id ? universities.find(uni => uni.id === id) : null;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: universityData?.name || "",
      overview: "",
      admissionStats: "",
      applicationRequirements: "",
      alumniInsights: "",
    },
  });

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) return;
      
      // Check if the user has admin role in metadata
      const isUserAdmin = user.user_metadata?.role === 'admin';
      setIsAdmin(isUserAdmin);
      
      if (!isUserAdmin) {
        toast.error("You don't have permission to access this page");
        navigate('/');
      }
    };
    
    if (!loading) {
      if (!user) {
        toast.error("Please sign in to access this page");
        navigate('/auth');
        return;
      }
      
      checkAdminStatus();
    }
  }, [user, loading, navigate]);

  // Load existing university content
  useEffect(() => {
    if (id && isAdmin) {
      const loadUniversityContent = async () => {
        setIsLoadingContent(true);
        try {
          const content = await getUniversityContent(id);
          
          if (content) {
            // Populate the form with existing data
            form.reset({
              name: content.name || universityData?.name || "",
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
  }, [id, isAdmin, form]);

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
      const fileName = `${id}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `university-images/${fileName}`;

      // Upload the file
      const { error: uploadError } = await supabase.storage
        .from('university-content')
        .upload(filePath, imageFile);

      if (uploadError) {
        throw uploadError;
      }

      // Get the public URL
      const { data } = supabase.storage
        .from('university-content')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image");
      return null;
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    
    try {
      // First upload image if there's a new one
      const uploadedImageUrl = await uploadImage();
      
      // Save university content
      await saveUniversityContent(id!, {
        ...values,
        image: uploadedImageUrl || imageUrl,
      });

      toast.success("University content updated successfully");
      navigate(`/insights/universities/${id}`);
    } catch (error) {
      console.error("Error saving university content:", error);
      toast.error("Failed to save university content");
    } finally {
      setIsLoading(false);
    }
  };

  if (loading || isLoadingContent) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy mx-auto"></div>
          <p className="mt-4 text-navy">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <main className="container-custom py-12">
          <div className="max-w-6xl mx-auto text-center">
            <ShieldAlert className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-navy mb-4">Access Denied</h1>
            <p className="mb-6">You need to be signed in as an administrator to access this page.</p>
            <Button onClick={() => navigate("/auth")}>
              Go to Sign In
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>{universityData ? `Edit ${universityData.name}` : "Add New University"} | AlumniSights</title>
        <meta name="description" content="Manage university content for undergraduate admissions" />
      </Helmet>

      <Navbar />

      <main className="container-custom py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-navy mb-8">
            {universityData ? `Edit ${universityData.name}` : "Add New University"}
          </h1>

          <Card>
            <CardContent className="pt-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>University Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Harvard University" {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="overview"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Overview</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Provide an overview of the university..."
                                className="min-h-[150px]"
                                {...field} 
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="admissionStats"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Admission Statistics</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Enter acceptance rate, GPA range, test scores..."
                                className="min-h-[150px]"
                                {...field} 
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="space-y-6">
                      <FormItem>
                        <FormLabel>University Image</FormLabel>
                        <div className="border rounded-md p-2">
                          <div className="mb-2">
                            {imagePreview ? (
                              <div className="relative">
                                <img 
                                  src={imagePreview} 
                                  alt="University preview" 
                                  className="w-full h-48 object-cover rounded-md"
                                />
                                <Button 
                                  type="button" 
                                  variant="destructive"
                                  size="sm"
                                  className="absolute top-2 right-2"
                                  onClick={() => {
                                    setImageFile(null);
                                    setImagePreview(null);
                                    setImageUrl(null);
                                  }}
                                >
                                  Remove
                                </Button>
                              </div>
                            ) : (
                              <div className="w-full h-48 bg-gray-100 flex flex-col items-center justify-center rounded-md">
                                <Image className="h-8 w-8 text-gray-400 mb-2" />
                                <p className="text-sm text-gray-500">No image uploaded</p>
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

                      <FormField
                        control={form.control}
                        name="applicationRequirements"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Application Requirements</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="List required materials, deadlines, essays..."
                                className="min-h-[150px]" 
                                {...field} 
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="alumniInsights"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Alumni Insights (optional)</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Add any quotes or insights from alumni..."
                                className="min-h-[100px]" 
                                {...field} 
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <div className="flex gap-4 justify-end">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => navigate("/insights/university-content-manager")}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? "Saving..." : (universityData ? "Update" : "Create")}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default UniversityContentEditor;
