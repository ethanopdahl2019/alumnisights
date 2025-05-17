
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
    
    // Get OpenAI API key and validate thoroughly
    const openaiApiKey = Deno.env.get("OPENAI_API_KEY");
    
    // Log key presence (but not the actual key)
    console.log("Checking OpenAI API key...");
    
    if (!openaiApiKey || openaiApiKey.trim() === "") {
      console.error("ERROR: OpenAI API key is missing or empty");
      return new Response(JSON.stringify({ 
        error: "OpenAI API key not configured or is empty", 
        details: "Please add the OPENAI_API_KEY secret in the Supabase Dashboard"
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      });
    } else {
      console.log("API key found, length:", openaiApiKey.length);
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
    
    console.log(`Making OpenAI API request for ${universityName}, content type: ${contentType}...`);
    
    // Prepare headers with correct Bearer token format
    const headers = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${openaiApiKey}`
    };
    
    // Log header existence (not values)
    console.log("Request headers prepared with authorization");
    
    // Direct log for debugging (should be removed in production)
    console.log("Request URL:", "https://api.openai.com/v1/chat/completions");
    console.log("Request method:", "POST");
    
    try {
      // Call OpenAI API
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: headers,
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
      
      console.log("OpenAI API response received, status:", response.status);
      
      // Handle non-OK responses
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`OpenAI API error (${response.status}):`, errorText);
        
        // Special handling for common errors
        if (response.status === 401) {
          console.error("AUTHENTICATION ERROR: Invalid or expired API key");
          return new Response(JSON.stringify({ 
            error: "OpenAI API authentication failed. Please check your API key.",
            details: errorText
          }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 500,
          });
        } else if (response.status === 429) {
          return new Response(JSON.stringify({ 
            error: "OpenAI API rate limit exceeded. Please try again later.",
            details: errorText
          }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 500,
          });
        }
        
        return new Response(JSON.stringify({ 
          error: `OpenAI API error: ${response.status}`,
          details: errorText
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        });
      }
      
      // Parse response JSON
      const data = await response.json();
      console.log("Successfully parsed OpenAI response");
      
      // Verify that we have the expected data
      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        console.error("Unexpected response format from OpenAI:", JSON.stringify(data).substring(0, 200));
        return new Response(JSON.stringify({ 
          error: "Invalid response format from OpenAI",
          details: JSON.stringify(data).substring(0, 200)
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        });
      }
      
      const rawContent = data.choices[0].message.content;
      console.log("Content received, length:", rawContent.length);
      
      // Process the response to extract appropriate sections
      const result: any = {};
      
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
      
      console.log("Generated result with keys:", Object.keys(result).join(", "));
      
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
      
    } catch (fetchError) {
      console.error("Fetch error when calling OpenAI:", fetchError);
      return new Response(JSON.stringify({ 
        error: "Error calling OpenAI API",
        details: fetchError.message || "Unknown fetch error"
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      });
    }
    
  } catch (error) {
    console.error("Error in edge function:", error);
    return new Response(JSON.stringify({ 
      error: "Error generating university content",
      details: error.message || "Unknown error"
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
