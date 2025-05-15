
import { supabase } from "@/integrations/supabase/client";

export async function generateUniversityContent(name: string): Promise<{
  overview: string;
  admissionStats: string;
  applicationRequirements: string;
  alumniInsights: string;
} | null> {
  try {
    const { data, error } = await supabase.functions.invoke("generate-university-content", {
      body: { name },
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
