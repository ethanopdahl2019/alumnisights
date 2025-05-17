
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
import { generateUniversityContent } from "@/services/ai/generateUniversityContent";
import { toast } from "sonner";
import { Wand, Loader2 } from "lucide-react";

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

  // State for AI generation
  const [isGeneratingAll, setIsGeneratingAll] = React.useState(false);
  const [isGeneratingOverview, setIsGeneratingOverview] = React.useState(false);
  const [isGeneratingAdmissionStats, setIsGeneratingAdmissionStats] = React.useState(false);
  const [isGeneratingApplicationReqs, setIsGeneratingApplicationReqs] = React.useState(false);
  const [isGeneratingAlumniInsights, setIsGeneratingAlumniInsights] = React.useState(false);

  // Function to generate content for a specific section
  const generateSectionContent = async (section: "overview" | "admissionStats" | "applicationRequirements" | "alumniInsights") => {
    if (!form.getValues("name")) {
      toast.warning("Please enter the university name first");
      return;
    }
    
    // Set the loading state for the specific section
    switch (section) {
      case "overview":
        setIsGeneratingOverview(true);
        break;
      case "admissionStats":
        setIsGeneratingAdmissionStats(true);
        break;
      case "applicationRequirements":
        setIsGeneratingApplicationReqs(true);
        break;
      case "alumniInsights":
        setIsGeneratingAlumniInsights(true);
        break;
    }
    
    toast.info(`Generating ${section} with AI...`);
    
    try {
      const aiContent = await generateUniversityContent(form.getValues("name"), section);
      
      if (aiContent) {
        if (section === "overview" && aiContent.overview) {
          form.setValue("overview", aiContent.overview);
        } else if (section === "admissionStats" && aiContent.admissionStats) {
          form.setValue("admissionStats", aiContent.admissionStats);
        } else if (section === "applicationRequirements" && aiContent.applicationRequirements) {
          form.setValue("applicationRequirements", aiContent.applicationRequirements);
        } else if (section === "alumniInsights" && aiContent.alumniInsights) {
          form.setValue("alumniInsights", aiContent.alumniInsights);
        }
        toast.success(`${section.charAt(0).toUpperCase() + section.slice(1)} content generated!`);
      } else {
        toast.error(`Failed to generate ${section} content, try again`);
      }
    } catch (e) {
      toast.error(`Error generating ${section} content`);
      console.error(e);
    } finally {
      // Reset the loading state for the specific section
      switch (section) {
        case "overview":
          setIsGeneratingOverview(false);
          break;
        case "admissionStats":
          setIsGeneratingAdmissionStats(false);
          break;
        case "applicationRequirements":
          setIsGeneratingApplicationReqs(false);
          break;
        case "alumniInsights":
          setIsGeneratingAlumniInsights(false);
          break;
      }
    }
  };

  // Generate all content at once
  const handleGenerateAllContent = async () => {
    if (!form.getValues("name")) {
      toast.warning("Please enter the university name first");
      return;
    }
    setIsGeneratingAll(true);
    toast.info("Generating all content with AI...");
    try {
      const aiContent = await generateUniversityContent(form.getValues("name"), "all");
      if (aiContent) {
        form.setValue("overview", aiContent.overview || "");
        form.setValue("admissionStats", aiContent.admissionStats || "");
        form.setValue("applicationRequirements", aiContent.applicationRequirements || "");
        form.setValue("alumniInsights", aiContent.alumniInsights || "");
        toast.success("All content generated!");
      } else {
        toast.error("Failed to generate content, try again");
      }
    } catch (e) {
      toast.error("Error generating content");
      console.error(e);
    } finally {
      setIsGeneratingAll(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex justify-between items-center mb-4">
          <div></div>
          <Button 
            type="button" 
            variant="secondary" 
            onClick={handleGenerateAllContent}
            disabled={isGeneratingAll}
          >
            {isGeneratingAll ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Wand className="w-4 h-4 mr-2" />
                Generate All Content with AI
              </>
            )}
          </Button>
        </div>
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
                  <div className="flex justify-between items-center">
                    <FormLabel>Overview</FormLabel>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => generateSectionContent("overview")}
                      disabled={isGeneratingOverview}
                      className="h-8"
                    >
                      {isGeneratingOverview ? (
                        <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                      ) : (
                        <Wand className="w-3 h-3 mr-1" />
                      )}
                      Generate
                    </Button>
                  </div>
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
                  <div className="flex justify-between items-center">
                    <FormLabel>Admission Statistics</FormLabel>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => generateSectionContent("admissionStats")}
                      disabled={isGeneratingAdmissionStats}
                      className="h-8"
                    >
                      {isGeneratingAdmissionStats ? (
                        <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                      ) : (
                        <Wand className="w-3 h-3 mr-1" />
                      )}
                      Generate
                    </Button>
                  </div>
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
                  <div className="flex justify-between items-center">
                    <FormLabel>Application Requirements</FormLabel>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => generateSectionContent("applicationRequirements")}
                      disabled={isGeneratingApplicationReqs}
                      className="h-8"
                    >
                      {isGeneratingApplicationReqs ? (
                        <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                      ) : (
                        <Wand className="w-3 h-3 mr-1" />
                      )}
                      Generate
                    </Button>
                  </div>
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
                  <div className="flex justify-between items-center">
                    <FormLabel>Alumni Insights (optional)</FormLabel>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => generateSectionContent("alumniInsights")}
                      disabled={isGeneratingAlumniInsights}
                      className="h-8"
                    >
                      {isGeneratingAlumniInsights ? (
                        <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                      ) : (
                        <Wand className="w-3 h-3 mr-1" />
                      )}
                      Generate
                    </Button>
                  </div>
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
