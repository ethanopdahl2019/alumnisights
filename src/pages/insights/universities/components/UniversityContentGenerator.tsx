
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { generateUniversityContent, saveGeneratedContent, GeneratedUniversityContent } from "@/services/ai/universityContentGenerator";
import { universities } from "../universities-data";

interface UniversityContentGeneratorProps {
  universityId: string;
  universityName: string;
  onComplete?: () => void;
}

const UniversityContentGenerator: React.FC<UniversityContentGeneratorProps> = ({
  universityId,
  universityName,
  onComplete
}) => {
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<GeneratedUniversityContent | null>(null);
  const [selectedSections, setSelectedSections] = useState<Array<'overview' | 'admissionStats' | 'applicationRequirements' | 'alumniInsights'>>([
    'overview',
    'admissionStats',
    'applicationRequirements',
    'alumniInsights'
  ]);

  const toggleSection = (section: 'overview' | 'admissionStats' | 'applicationRequirements' | 'alumniInsights') => {
    setSelectedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section) 
        : [...prev, section]
    );
  };

  const handleGenerate = async () => {
    if (selectedSections.length === 0) return;
    
    setIsGenerating(true);
    try {
      const content = await generateUniversityContent(universityName, selectedSections);
      setGeneratedContent(content);
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePublish = async () => {
    if (!generatedContent) return;
    
    setIsPublishing(true);
    try {
      const success = await saveGeneratedContent(universityId, universityName, generatedContent);
      if (success && onComplete) {
        onComplete();
      }
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Content Generator</CardTitle>
        <CardDescription>
          Generate content for {universityName} automatically using AI
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <div className="text-sm font-medium">Select sections to generate:</div>
          
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="overview" 
                checked={selectedSections.includes('overview')}
                onCheckedChange={() => toggleSection('overview')}
              />
              <label htmlFor="overview" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                University Overview
              </label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="admissionStats" 
                checked={selectedSections.includes('admissionStats')}
                onCheckedChange={() => toggleSection('admissionStats')}
              />
              <label htmlFor="admissionStats" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Admission Statistics
              </label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="applicationRequirements" 
                checked={selectedSections.includes('applicationRequirements')}
                onCheckedChange={() => toggleSection('applicationRequirements')}
              />
              <label htmlFor="applicationRequirements" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Application Requirements
              </label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="alumniInsights" 
                checked={selectedSections.includes('alumniInsights')}
                onCheckedChange={() => toggleSection('alumniInsights')}
              />
              <label htmlFor="alumniInsights" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Alumni Insights
              </label>
            </div>
          </div>
        </div>
        
        {generatedContent && (
          <div className="mt-4 space-y-4">
            {generatedContent.overview && (
              <div className="space-y-2">
                <h3 className="font-medium">Overview</h3>
                <div className="text-sm bg-gray-50 p-3 rounded-md border max-h-48 overflow-auto whitespace-pre-line">
                  {generatedContent.overview}
                </div>
              </div>
            )}
            
            {generatedContent.admissionStats && (
              <div className="space-y-2">
                <h3 className="font-medium">Admission Statistics</h3>
                <div className="text-sm bg-gray-50 p-3 rounded-md border max-h-48 overflow-auto whitespace-pre-line">
                  {generatedContent.admissionStats}
                </div>
              </div>
            )}
            
            {generatedContent.applicationRequirements && (
              <div className="space-y-2">
                <h3 className="font-medium">Application Requirements</h3>
                <div className="text-sm bg-gray-50 p-3 rounded-md border max-h-48 overflow-auto whitespace-pre-line">
                  {generatedContent.applicationRequirements}
                </div>
              </div>
            )}
            
            {generatedContent.alumniInsights && (
              <div className="space-y-2">
                <h3 className="font-medium">Alumni Insights</h3>
                <div className="text-sm bg-gray-50 p-3 rounded-md border max-h-48 overflow-auto whitespace-pre-line">
                  {generatedContent.alumniInsights}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => navigate(`/insights/undergraduate-admissions/${universityId}`)}
        >
          Cancel
        </Button>
        
        <div className="space-x-2">
          <Button
            onClick={handleGenerate}
            disabled={isGenerating || selectedSections.length === 0}
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              'Generate Content'
            )}
          </Button>
          
          {generatedContent && (
            <Button
              onClick={handlePublish}
              disabled={isPublishing}
              variant="default"
            >
              {isPublishing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Publish Content
                </>
              )}
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default UniversityContentGenerator;
