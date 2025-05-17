
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
    
    // Extract request body
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
    
    // Build system message to control AI behavior and format
    const systemMessage = "You are an expert on universities that creates accurate, informative content for prospective students. Generate factual, clear, and concise content without marketing language. Your response should be in paragraph format without headings or bullet points.";

    // Configure user prompt based on content type
    let userPrompt = `Write detailed content about ${universityName} for the following category: `;
    
    if (contentType === "overview" || contentType === "all") {
      userPrompt += contentType === "all" ? 
        "\n\n1. Overview: Provide a comprehensive overview of the university, including its history, academic reputation, campus culture, location advantages, and what makes it unique." : 
        "University Overview. Cover its history, academic reputation, campus culture, location, and what makes it unique.";
    }
    
    if (contentType === "admissionStats" || contentType === "all") {
      userPrompt += contentType === "all" ? 
        "\n\n2. Admission Statistics: Provide specific admission statistics for this university, including acceptance rates, average GPAs, standardized test scores, and recent application trends." : 
        "Admission Statistics. Include acceptance rates, average GPAs, standardized test scores, and recent application trends.";
    }
    
    if (contentType === "applicationRequirements" || contentType === "all") {
      userPrompt += contentType === "all" ? 
        "\n\n3. Application Requirements: Explain the specific application requirements for this university, including deadlines, required documentation, essays, interviews, and any special requirements." : 
        "Application Requirements. Cover deadlines, required documentation, essays, interviews, and any special requirements.";
    }
    
    if (contentType === "alumniInsights" || contentType === "all") {
      userPrompt += contentType === "all" ? 
        "\n\n4. Alumni Insights: Share insights from alumni about their experience at the school, what they valued most, and advice for prospective students." : 
        "Alumni Insights. Share perspectives from graduates about their experience, what they valued most, and advice for prospective students.";
    }
    
    if (contentType === "didYouKnow" || contentType === "all") {
      userPrompt += contentType === "all" ? 
        "\n\n5. Did You Know: Provide a single interesting and surprising fact about this university that most people don't know. Start with 'Did you know that...' and keep it to 1-2 sentences." : 
        "Provide an interesting and surprising fact about this university that most people don't know. Start with 'Did you know that...' and keep it brief (1-2 sentences).";
    }
    
    if (contentType === "all") {
      userPrompt += "\n\nSeparate each category with a blank line. Do not include category headers or numbers in your response.";
    }
    
    console.log(`Making OpenAI API request for ${universityName}, content type: ${contentType}...`);
    console.log("User prompt:", userPrompt.substring(0, 100) + "...");
    
    // Prepare headers with correct Bearer token format
    const headers = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${openaiApiKey}`
    };
    
    // Log header existence (not values)
    console.log("Request headers prepared with authorization");
    
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
              content: systemMessage,
            },
            {
              role: "user",
              content: userPrompt,
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
        // Parse the complete response into sections by splitting on double newlines
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
