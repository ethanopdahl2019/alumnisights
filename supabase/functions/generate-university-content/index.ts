
// Import required modules for Deno
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// CORS headers for cross-origin requests
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Handle requests
serve(async (req) => {
  // Handle preflight CORS requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders,
      status: 204,
    });
  }
  
  try {
    console.log("Processing content generation request...");
    const { universityName, contentType } = await req.json();
    
    if (!universityName) {
      return new Response(JSON.stringify({ error: "University name is required" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }
    
    // OpenAI API call configuration
    const openaiApiKey = Deno.env.get("OPENAI_API_KEY");
    if (!openaiApiKey) {
      console.error("OpenAI API key not configured");
      return new Response(JSON.stringify({ error: "OpenAI API key not configured" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      });
    }
    
    // Configure the prompt based on content type
    let prompt = "";
    
    if (contentType === "overview" || contentType === "all") {
      prompt += `Write a comprehensive overview of ${universityName}, including its history, academic reputation, campus culture, and what makes it unique. Format as a paragraph or two without headers.\n\n`;
    }
    
    if (contentType === "admissionStats" || contentType === "all") {
      prompt += `Provide recent admission statistics for ${universityName}, including acceptance rates, average GPAs, standardized test scores, and application trends. Format as a paragraph without headers.\n\n`;
    }
    
    if (contentType === "applicationRequirements" || contentType === "all") {
      prompt += `Explain the application requirements for ${universityName}, including deadlines, required documentation, essays, interviews, and any special requirements. Format as a paragraph without headers.\n\n`;
    }
    
    if (contentType === "alumniInsights" || contentType === "all") {
      prompt += `Share insights from alumni of ${universityName} about their experience at the school, what they wish they knew before applying, and advice for prospective students. Format as a paragraph without headers.\n\n`;
    }
    
    if (contentType === "didYouKnow" || contentType === "all") {
      prompt += `Provide a single interesting and surprising fact about ${universityName} that most people don't know. Keep it brief - just 1-2 sentences maximum. Start with "Did you know that..."\n\n`;
    }
    
    console.log("Sending prompt to OpenAI:", prompt);
    
    // Call OpenAI API
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${openaiApiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant that generates accurate, concise, and neutral information about universities for prospective students. Provide factual information without marketing language.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenAI API error response:", errorText);
      try {
        const errorData = JSON.parse(errorText);
        throw new Error(`OpenAI API error: ${JSON.stringify(errorData)}`);
      } catch (parseError) {
        throw new Error(`OpenAI API error: ${response.status} - ${errorText.substring(0, 200)}`);
      }
    }
    
    const data = await response.json();
    const rawContent = data.choices[0].message.content;
    
    console.log("Received content from OpenAI:", rawContent.substring(0, 100) + "...");
    
    // Process the response to extract appropriate sections
    const result = {};
    
    if (contentType === "all") {
      // Parse the complete response into sections
      const sections = rawContent.split("\n\n").filter(section => section.trim() !== "");
      
      // Assign sections to appropriate keys based on the order requested
      let sectionIndex = 0;
      
      if (sections[sectionIndex]) {
        result.overview = sections[sectionIndex];
        sectionIndex++;
      }
      
      if (sections[sectionIndex]) {
        result.admissionStats = sections[sectionIndex];
        sectionIndex++;
      }
      
      if (sections[sectionIndex]) {
        result.applicationRequirements = sections[sectionIndex];
        sectionIndex++;
      }
      
      if (sections[sectionIndex]) {
        result.alumniInsights = sections[sectionIndex];
        sectionIndex++;
      }
      
      if (sections[sectionIndex]) {
        result.didYouKnow = sections[sectionIndex];
      }
    } else {
      // For single content types, assign directly
      result[contentType] = rawContent;
    }
    
    console.log("Generated result:", JSON.stringify(result));
    
    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error generating university content:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
