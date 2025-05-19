
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, Check } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

interface UniversityContentFormProps {
  universityId: string;
  universityName: string;
  initialData?: UniversityFormData;
  onSubmit: (data: UniversityFormData) => Promise<boolean>;
  handleImageUpload: (file: File, type: "image" | "logo") => Promise<string | null>;
  logoPreview: string | null;
  imagePreview: string | null;
}

export interface UniversityFormData {
  name: string;
  overview: string;
  admissionStats: string;
  applicationRequirements: string;
  alumniInsights: string;
  didYouKnow: string;
  image?: string | null;
  logo?: string | null;
}

const UniversityContentForm: React.FC<UniversityContentFormProps> = ({
  universityId,
  universityName,
  initialData,
  onSubmit,
  handleImageUpload,
  logoPreview,
  imagePreview
}) => {
  const { register, handleSubmit, formState: { errors, isDirty } } = useForm<UniversityFormData>({
    defaultValues: initialData || {
      name: universityName,
      overview: "",
      admissionStats: "",
      applicationRequirements: "",
      alumniInsights: "",
      didYouKnow: "",
    }
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const onSubmitHandler = async (data: UniversityFormData) => {
    setIsSubmitting(true);
    try {
      const success = await onSubmit(data);
      if (success) {
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
        }, 3000);
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmitHandler)}>
      <div className="fixed bottom-4 right-4 z-50">
        {showSuccess && (
          <div className="bg-green-600 text-white px-4 py-3 rounded-md shadow-lg flex items-center space-x-2 animate-fade-in">
            <Check className="h-5 w-5" />
            <span>Content updated successfully!</span>
          </div>
        )}
      </div>

      <div className="grid gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
          <div className="grid gap-4">
            <div>
              <Label htmlFor="name">University Name</Label>
              <Input 
                id="name" 
                {...register("name", { required: "Name is required" })} 
                placeholder="University Name" 
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
            </div>
            
            <div>
              <Label htmlFor="didYouKnow">Did You Know? <span className="text-sm text-gray-500">(Interesting fact about the university)</span></Label>
              <Textarea 
                id="didYouKnow"
                {...register("didYouKnow")}
                placeholder="Share an interesting fact about this university" 
                className="min-h-[80px]"
              />
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Overview</h3>
          <div>
            <Textarea 
              {...register("overview", { required: "Overview is required" })}
              placeholder="Provide a general overview of the university" 
              className="min-h-[200px]"
            />
            {errors.overview && <p className="text-red-500 text-sm mt-1">{errors.overview.message}</p>}
          </div>
        </Card>
        
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Admission Statistics</h3>
          <div>
            <Textarea 
              {...register("admissionStats")}
              placeholder="Describe the admission statistics and trends" 
              className="min-h-[200px]"
            />
          </div>
          <p className="text-sm text-gray-500 mt-2">Note: Numeric statistics (acceptance rate, SAT, ACT) can be managed in the Admin Dashboard.</p>
        </Card>
        
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Application Requirements</h3>
          <div>
            <Textarea 
              {...register("applicationRequirements")}
              placeholder="List and explain application requirements" 
              className="min-h-[200px]"
            />
          </div>
        </Card>
        
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Alumni Insights</h3>
          <div>
            <Textarea 
              {...register("alumniInsights")}
              placeholder="Share insights and advice from alumni" 
              className="min-h-[200px]"
            />
          </div>
        </Card>
        
        <div className="flex justify-end">
          <Button 
            type="submit" 
            disabled={isSubmitting || !isDirty}
            className="w-full md:w-auto"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Content'
            )}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default UniversityContentForm;
