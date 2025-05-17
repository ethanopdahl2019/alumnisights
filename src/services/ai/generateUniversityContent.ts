
interface GeneratedContent {
  overview?: string;
  admissionStats?: string;
  applicationRequirements?: string;
  alumniInsights?: string;
  didYouKnow?: string;
}

export async function generateUniversityContent(
  universityName: string,
  contentType: "overview" | "admissionStats" | "applicationRequirements" | "alumniInsights" | "didYouKnow" | "all"
): Promise<GeneratedContent> {
  try {
    console.log(`Generating ${contentType} content for ${universityName}...`);
    
    // Call the OpenAI API through our Supabase Edge Function with proper error handling
    const response = await fetch("https://xvnhujckrivhjnaslanm.supabase.co/functions/v1/generate-university-content", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        universityName,
        contentType,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Error response: ${response.status}`, errorText);
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    console.log("Received data from edge function:", data);
    
    if (data.error) {
      throw new Error(data.error);
    }
    
    // If we're generating didYouKnow content, ensure it's short and interesting
    if (contentType === "didYouKnow" && data.didYouKnow) {
      // Limit to approximately 1-2 sentences if it's too long
      const sentences = data.didYouKnow.split('. ');
      if (sentences.length > 2) {
        data.didYouKnow = sentences.slice(0, 2).join('. ') + '.';
      }
    }
    
    return data;
  } catch (error) {
    console.error("Error generating university content:", error);
    throw error;
  }
}
