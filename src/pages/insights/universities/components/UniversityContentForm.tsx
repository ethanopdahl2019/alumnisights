
import React from "react";
import { useNavigate } from "react-router-dom";
import { 
  Form,
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import UniversityImageUpload from "./UniversityImageUpload";
import { useUniversityContentForm } from "../hooks/useUniversityContentForm";

interface UniversityContentFormProps {
  id?: string;
  universityName?: string;
}

const UniversityContentForm: React.FC<UniversityContentFormProps> = ({ id, universityName }) => {
  const navigate = useNavigate();
  const {
    form,
    isLoading,
    imagePreview,
    logoPreview,
    handleImageChange,
    handleLogoChange,
    onSubmit,
    resetImage,
    resetLogo
  } = useUniversityContentForm({ id, universityName });

  return (
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

            <UniversityImageUpload 
              imagePreview={logoPreview}
              onImageChange={handleLogoChange}
              onImageRemove={resetLogo}
              id="logo-upload"
              label="University Logo"
              helpText="Upload the university logo (square format recommended)"
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
            <UniversityImageUpload 
              imagePreview={imagePreview}
              onImageChange={handleImageChange}
              onImageRemove={resetImage}
              id="image-upload"
              label="University Image"
              helpText="Upload a feature image for the university"
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
            onClick={() => navigate("/insights/undergraduate-admissions")}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : (id ? "Update" : "Create")}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default UniversityContentForm;
