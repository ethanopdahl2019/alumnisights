import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { useUniversityContentForm } from "../hooks/useUniversityContentForm";
import UniversityImageUpload from "./UniversityImageUpload";

export interface UniversityContentFormProps {
  universityId: string;
  universityName: string;
  initialImage?: string | null;
  initialLogo?: string | null;
}

const UniversityContentForm: React.FC<UniversityContentFormProps> = ({
  universityId,
  universityName,
  initialImage,
  initialLogo
}) => {
  const navigate = useNavigate();
  const [name, setName] = useState<string>(universityName || "");
  const [overview, setOverview] = useState<string>("");
  const [admissionStats, setAdmissionStats] = useState<string>("");
  const [applicationRequirements, setApplicationRequirements] = useState<string>("");
  const [alumniInsights, setAlumniInsights] = useState<string>("");
  const [didYouKnow, setDidYouKnow] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string | null>(initialImage || null);
  const [logoUrl, setLogoUrl] = useState<string | null>(initialLogo || null);
  const [activeTab, setActiveTab] = useState<string>("overview");
  const { handleSubmit, isSubmitting } = useUniversityContentForm(universityId);

  // Handlers for form submission and navigation
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const success = await handleSubmit({
      name,
      overview,
      admissionStats,
      applicationRequirements,
      alumniInsights,
      didYouKnow,
      image: imageUrl,
      logo: logoUrl
    });
    
    if (success) {
      // Navigate back to university page on success
      navigate(`/insights/undergraduate-admissions/${universityId}`);
    }
  };
  
  const handleCancel = () => {
    navigate(`/insights/undergraduate-admissions/${universityId}`);
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-6">
          <div className="space-y-2">
            <Label htmlFor="name">University Name</Label>
            <Input 
              id="name" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required
            />
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
          <TabsList className="grid grid-cols-2 md:grid-cols-6 mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="admissions">Admissions</TabsTrigger>
            <TabsTrigger value="requirements">Requirements</TabsTrigger>
            <TabsTrigger value="alumni">Alumni</TabsTrigger>
            <TabsTrigger value="didYouKnow">Did You Know</TabsTrigger>
            <TabsTrigger value="images">Images</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="overview">University Overview</Label>
              <Textarea 
                id="overview" 
                value={overview} 
                onChange={(e) => setOverview(e.target.value)} 
                rows={10}
                placeholder="Provide an overview of the university including history, location, campus, and academic reputation."
              />
            </div>
          </TabsContent>
          
          <TabsContent value="admissions" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="admissionStats">Admission Statistics & Information</Label>
              <Textarea 
                id="admissionStats" 
                value={admissionStats} 
                onChange={(e) => setAdmissionStats(e.target.value)} 
                rows={10}
                placeholder="Provide details about acceptance rates, average test scores, and other admissions statistics."
              />
            </div>
          </TabsContent>
          
          <TabsContent value="requirements" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="applicationRequirements">Application Requirements</Label>
              <Textarea 
                id="applicationRequirements" 
                value={applicationRequirements} 
                onChange={(e) => setApplicationRequirements(e.target.value)} 
                rows={10}
                placeholder="List application requirements, deadlines, required documents, and fees."
              />
            </div>
          </TabsContent>
          
          <TabsContent value="alumni" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="alumniInsights">Alumni Insights</Label>
              <Textarea 
                id="alumniInsights" 
                value={alumniInsights} 
                onChange={(e) => setAlumniInsights(e.target.value)} 
                rows={10}
                placeholder="Share insights from alumni about their experience, career outcomes, and advice."
              />
            </div>
          </TabsContent>
          
          <TabsContent value="didYouKnow" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="didYouKnow">Did You Know</Label>
              <Textarea 
                id="didYouKnow" 
                value={didYouKnow} 
                onChange={(e) => setDidYouKnow(e.target.value)} 
                rows={6}
                placeholder="Share interesting facts or trivia about the university."
              />
            </div>
          </TabsContent>
          
          <TabsContent value="images" className="space-y-8">
            <div className="space-y-4">
              <Label>University Logo</Label>
              <UniversityImageUpload 
                initialImage={logoUrl}
                onImageUpload={setLogoUrl}
                aspectRatio="1:1"
                description="Upload a square logo for the university (recommended size: 400x400px)"
              />
            </div>
            
            <div className="space-y-4">
              <Label>Cover Image</Label>
              <UniversityImageUpload 
                initialImage={imageUrl}
                onImageUpload={setImageUrl}
                aspectRatio="16:9"
                description="Upload a cover image for the university page (recommended size: 1600x900px)"
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      <div className="flex justify-end space-x-2 pt-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={handleCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
};

export default UniversityContentForm;
