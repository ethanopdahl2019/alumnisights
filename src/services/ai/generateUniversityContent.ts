
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
    
    // Call the OpenAI API through our Supabase Edge Function with public access
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

    // Get the full response text first for better error diagnosis
    const responseText = await response.text();
    console.log("Response text received, length:", responseText.length);
    
    // Try to parse the response as JSON
    let data: GeneratedContent;
    try {
      data = JSON.parse(responseText);
      console.log("Parsed response data successfully", data);
    } catch (parseError) {
      console.error("Failed to parse JSON response:", parseError);
      console.error("Raw response text:", responseText.substring(0, 200));
      throw new Error(`Failed to parse response: ${responseText.substring(0, 200)}...`);
    }

    // Check for error in the parsed data
    if (data.error) {
      console.error("Error returned from edge function:", data.error);
      if (data.details) {
        console.error("Error details:", data.details);
      }
      throw new Error(data.error);
    }
    
    // Check if we received any content at all
    if (contentType === "all" && 
        !data.overview && 
        !data.admissionStats && 
        !data.applicationRequirements && 
        !data.alumniInsights && 
        !data.didYouKnow) {
      console.error("No content was generated for any section");
      throw new Error("No content was generated. Please try again.");
    }
    
    if (contentType !== "all" && !data[contentType]) {
      console.error(`No content was generated for ${contentType}`);
      throw new Error(`No content was generated for ${contentType}. Please try again.`);
    }
    
    // If we're generating didYouKnow content, ensure it's short and interesting
    if (contentType === "didYouKnow" && data.didYouKnow) {
      // Ensure it starts with "Did you know that..."
      if (!data.didYouKnow.toLowerCase().startsWith("did you know")) {
        data.didYouKnow = "Did you know that " + data.didYouKnow;
      }
      
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
