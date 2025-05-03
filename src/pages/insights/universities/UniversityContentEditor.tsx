
import React, { useState } from "react";
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

  // Find university if editing existing one
  const university = id ? universities.find(uni => uni.id === id) : null;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: university?.name || "",
      overview: "",
      admissionStats: "",
      applicationRequirements: "",
      alumniInsights: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    
    try {
      // This is where you would typically save the data to your backend
      // For now, we'll just simulate a successful save
      setTimeout(() => {
        toast.success(
          university 
            ? "University content updated successfully" 
            : "University content created successfully"
        );
        navigate("/insights/university-content-manager");
      }, 1000);
    } catch (error) {
      toast.error("Failed to save university content");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>{university ? `Edit ${university.name}` : "Add New University"} | AlumniSights</title>
        <meta name="description" content="Manage university content for undergraduate admissions" />
      </Helmet>

      <Navbar />

      <main className="container-custom py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-navy mb-8">
            {university ? `Edit ${university.name}` : "Add New University"}
          </h1>

          <Card>
            <CardContent className="pt-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                            className="min-h-[100px]"
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
                            className="min-h-[100px]"
                            {...field} 
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="applicationRequirements"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Application Requirements</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="List required materials, deadlines, essays..."
                            className="min-h-[100px]" 
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

                  <div className="flex gap-4 justify-end">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => navigate("/insights/university-content-manager")}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? "Saving..." : (university ? "Update" : "Create")}
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
