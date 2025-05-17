
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.3.0/mod.ts";

const openAIKey = Deno.env.get("OPENAI_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    if (!openAIKey) {
      return new Response(
        JSON.stringify({ error: "OpenAI API key not configured" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const { name, section } = await req.json();

    if (!name) {
      return new Response(
        JSON.stringify({ error: "University name is required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Create the appropriate prompt based on the requested section
    let prompt = "";
    let responseFormat = {};

    if (section === "all") {
      prompt = `Generate comprehensive content for ${name} university's undergraduate admissions page. Include:
      
      1. Overview: A comprehensive summary of the university including its history, academic strengths, campus culture, location, and what makes it unique.
      
      2. Admission Statistics: Realistic acceptance rate, average GPA, test score ranges, and relevant demographics.
      
      3. Application Requirements: Detailed list of required materials like essays, recommendation letters, deadlines, and any special requirements.
      
      4. Alumni Insights: 2-3 insightful perspectives, advice or experiences from fictional alumni about their time at the university.
      
      5. Did You Know: A single, interesting and surprising fact about the university (1-2 sentences only).
      
      Focus on being informative, accurate, and engaging. Format each section separately.`;

      responseFormat = {
        overview: "Overview content here...",
        admissionStats: "Admission statistics content here...",
        applicationRequirements: "Application requirements content here...",
        alumniInsights: "Alumni insights content here...",
        didYouKnow: "A concise and interesting fact about the university.",
      };
    } else if (section === "overview") {
      prompt = `Generate a comprehensive overview of ${name} university. Include its history, academic strengths, campus culture, location, and what makes it unique. This should be informative and engaging for prospective undergraduate students.`;
    } else if (section === "admissionStats") {
      prompt = `Generate realistic admission statistics for ${name} university, including acceptance rate, average GPA, test score ranges (SAT/ACT), and any other relevant metrics that might help a prospective undergraduate student understand their chances of admission.`;
    } else if (section === "applicationRequirements") {
      prompt = `Generate a detailed list of application requirements for undergraduate admission to ${name} university. Include information about required essays, recommendation letters, application deadlines, and any special or unique requirements specific to this university.`;
    } else if (section === "alumniInsights") {
      prompt = `Generate 2-3 perspectives or pieces of advice from fictional alumni about their experience at ${name} university. These should be insightful and offer unique perspectives about student life, academics, or post-graduation outcomes.`;
    } else if (section === "didYouKnow") {
      prompt = `Generate a single, interesting and surprising fact about ${name} university. It should be concise (1-2 sentences only) and capture something unique or notable about the university that many people might not know. Make it engaging and memorable.`;
    } else {
      return new Response(
        JSON.stringify({ error: "Invalid section specified" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Call OpenAI API
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${openAIKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are a knowledgeable assistant specialized in university admissions.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 1200,
      }),
    });

    const data = await response.json();

    if (!data.choices || data.choices.length === 0) {
      throw new Error("No response from OpenAI API");
    }

    const content = data.choices[0].message.content;

    // Parse the response based on the section requested
    let result = {};

    if (section === "all") {
      // For "all" section, try to parse the content into the expected format
      try {
        // Look for section markers in the content
        const overviewMatch = content.match(/(?:Overview|1\.)\s*:?\s*([\s\S]*?)(?=Admission Statistics|2\.|\n\s*\n\s*Admission|\n\s*\n\s*2\.)/i);
        const admissionStatsMatch = content.match(/(?:Admission Statistics|2\.)\s*:?\s*([\s\S]*?)(?=Application Requirements|3\.|\n\s*\n\s*Application|\n\s*\n\s*3\.)/i);
        const applicationRequirementsMatch = content.match(/(?:Application Requirements|3\.)\s*:?\s*([\s\S]*?)(?=Alumni Insights|4\.|\n\s*\n\s*Alumni|\n\s*\n\s*4\.)/i);
        const alumniInsightsMatch = content.match(/(?:Alumni Insights|4\.)\s*:?\s*([\s\S]*?)(?=Did You Know|5\.|\n\s*\n\s*Did|\n\s*\n\s*5\.)/i);
        const didYouKnowMatch = content.match(/(?:Did You Know|5\.)\s*:?\s*([\s\S]*?)(?=$)/i);

        result = {
          overview: overviewMatch ? overviewMatch[1].trim() : undefined,
          admissionStats: admissionStatsMatch ? admissionStatsMatch[1].trim() : undefined,
          applicationRequirements: applicationRequirementsMatch ? applicationRequirementsMatch[1].trim() : undefined,
          alumniInsights: alumniInsightsMatch ? alumniInsightsMatch[1].trim() : undefined,
          didYouKnow: didYouKnowMatch ? didYouKnowMatch[1].trim() : undefined,
        };
      } catch (e) {
        console.error("Error parsing content:", e);
        result = { error: "Failed to parse the generated content" };
      }
    } else {
      // For specific sections, just return the content
      result = { [section]: content.trim() };
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in generate-university-content function:", error);
    return new Response(
      JSON.stringify({
        error: "An error occurred while generating university content",
        details: error.message,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
