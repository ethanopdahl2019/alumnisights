
import { supabase } from "@/integrations/supabase/client";

export interface UniversityContentResponse {
  overview?: string;
  admissionStats?: string;
  applicationRequirements?: string;
  alumniInsights?: string;
  didYouKnow?: string;
}

export async function generateUniversityContent(
  name: string,
  section?: "overview" | "admissionStats" | "applicationRequirements" | "alumniInsights" | "didYouKnow" | "all"
): Promise<UniversityContentResponse | null> {
  try {
    const { data, error } = await supabase.functions.invoke("generate-university-content", {
      body: { name, section: section || "all" },
    });

    if (error) {
      console.error("AI generation error:", error);
      return null;
    }
    return data;
  } catch (err) {
    console.error("AI generation failed", err);
    return null;
  }
}
