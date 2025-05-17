
interface GeneratedContent {
  overview?: string;
  admissionStats?: string;
  applicationRequirements?: string;
  alumniInsights?: string;
  didYouKnow?: string;
  error?: string;
  details?: string;
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

    console.log("Edge function response status:", response.status);

    // Get the full response text first
    const responseText = await response.text();
    console.log("Response text received, length:", responseText.length);
    
    // Try to parse the response as JSON
    let data: GeneratedContent;
    try {
      data = JSON.parse(responseText);
      console.log("Parsed response data successfully");
    } catch (parseError) {
      console.error("Failed to parse JSON response:", parseError);
      console.error("Raw response text:", responseText.substring(0, 100));
      throw new Error(`Failed to parse response: ${responseText.substring(0, 100)}...`);
    }

    // Check for error in the parsed data
    if (data.error) {
      console.error("Error returned from edge function:", data.error);
      if (data.details) {
        console.error("Error details:", data.details);
      }
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
