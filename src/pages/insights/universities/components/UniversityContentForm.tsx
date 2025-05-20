
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { useUniversityContentForm } from "../hooks/useUniversityContentForm";
import UniversityImageUpload from "./UniversityImageUpload";
import { getUniversityContent } from "@/services/landing-page";

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
  const { handleSubmit, isSubmitting } = useUniversityContentForm(universityId);
  
  // Load existing content when component mounts
  useEffect(() => {
    const loadContent = async () => {
      try {
        const content = await getUniversityContent(universityId);
        if (content) {
          setName(content.name || universityName);
          setOverview(content.overview || "");
          setAdmissionStats(content.admission_stats || "");
          setApplicationRequirements(content.application_requirements || "");
          setAlumniInsights(content.alumni_insights || "");
          setDidYouKnow(content.did_you_know || "");
          if (content.image) setImageUrl(content.image);
          if (content.logo) setLogoUrl(content.logo);
        }
      } catch (error) {
        console.error("Failed to load university content:", error);
      }
    };
    
    loadContent();
  }, [universityId, universityName]);

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

        <div className="space-y-8">
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
          
          <div className="space-y-6">
            <div>
              <Label className="block mb-4">University Logo</Label>
              <UniversityImageUpload 
                initialImage={logoUrl}
                onImageUpload={(url) => setLogoUrl(url)}
                aspectRatio="1:1"
                description="Upload a square logo for the university (recommended size: 400x400px)"
              />
            </div>
            
            <div>
              <Label className="block mb-4">Cover Image</Label>
              <UniversityImageUpload 
                initialImage={imageUrl}
                onImageUpload={(url) => setImageUrl(url)}
                aspectRatio="16:9"
                description="Upload a cover image for the university page (recommended size: 1600x900px)"
              />
            </div>
          </div>
        </div>
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
