
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Use OpenAI API key from Supabase secrets
const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  try {
    const { name, section } = await req.json();

    if (!name) {
      return new Response(JSON.stringify({ error: "University name required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // Define prompt based on the requested section
    let prompt = "";
    
    if (!section || section === "all") {
      // If no specific section is requested, generate all content
      prompt = `
You are an AI specializing in creating detailed university guides. For "${name}", generate the following as Markdown strings:

1. **Overview:** A comprehensive overview of the university (detailed history, background, unique features, campus environment, location description, notable achievements, and what makes it stand out from other institutions).

2. **Admission Statistics:** Realistic and detailed admission statistics – acceptance rate trends over recent years, average GPA requirements, typical test score ranges (SAT/ACT), application numbers and yield rates, notable demographic information, and transfer acceptance rates.

3. **Application Requirements:** Detailed undergraduate admissions requirements including application deadlines (regular, early decision, early action), required standardized tests and score ranges, essay prompts, recommendation letter requirements, interview processes, application fees, and any special requirements for specific programs.

4. **Alumni Insights:** Two to three compelling, detailed quotes or insights from alumni about their experiences, including specific benefits of attending, career outcomes, and meaningful campus experiences.

Your response should be detailed (at least 300-400 words for each section) and formatted in valid JSON format with these properties: overview, admissionStats, applicationRequirements, alumniInsights.
`;
    } else if (section === "overview") {
      prompt = `
You are an AI specializing in creating detailed university guides. For "${name}", generate a comprehensive overview of the university. Include:

- Detailed history and founding
- Notable achievements and academic reputation
- Campus environment and facilities
- Location details and surrounding area
- Unique features and traditions
- Student life highlights
- What makes it stand out from other institutions

Your response should be detailed (at least 400-500 words) and formatted as a valid JSON object with a single property: "overview".
`;
    } else if (section === "admissionStats") {
      prompt = `
You are an AI specializing in university admission statistics. For "${name}", generate realistic and detailed admission statistics including:

- Acceptance rate trends over recent years
- Average GPA requirements
- Typical SAT/ACT score ranges
- Application volume statistics
- Yield rates (percentage of admitted students who enroll)
- Notable demographic information
- Transfer acceptance rates
- Early decision/action vs regular admission statistics

Your response should be detailed (at least 400 words) and formatted as a valid JSON object with a single property: "admissionStats".
`;
    } else if (section === "applicationRequirements") {
      prompt = `
You are an AI specializing in university application requirements. For "${name}", generate detailed undergraduate admission requirements including:

- Application deadlines (regular, early decision, early action)
- Required standardized tests and score ranges
- Essay prompts and writing requirements
- Recommendation letter requirements
- Interview processes and policies
- Application fees and fee waiver information
- Special requirements for specific programs or majors
- Documentation needed for international students

Your response should be detailed (at least 400 words) and formatted as a valid JSON object with a single property: "applicationRequirements".
`;
    } else if (section === "alumniInsights") {
      prompt = `
You are an AI specializing in alumni perspectives. For "${name}", generate 2-3 compelling, detailed quotes or insights from alumni about their experiences, including:

- Specific benefits they gained from attending
- Career outcomes and opportunities
- Meaningful campus experiences and relationships
- How their education prepared them for their career
- Reflections on their college choice after graduation

Create diverse perspectives from alumni in different fields and graduation years. Make the quotes feel authentic and personal.

Your response should be detailed (at least 300 words) and formatted as a valid JSON object with a single property: "alumniInsights".
`;
    }

    const fetchResp = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are a helpful university admissions expert with extensive knowledge of US universities.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 2500,
      }),
    });

    if (!fetchResp.ok) {
      const errorBody = await fetchResp.text();
      return new Response(JSON.stringify({ error: "OpenAI API error", details: errorBody }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }
    const openai = await fetchResp.json();
    // Try parsing out the JSON in the response
    let content = openai.choices?.[0]?.message?.content;
    let data;
    try {
      data = JSON.parse(content);
    } catch (err) {
      // Try to extract JSON from a Markdown code block if necessary
      const match = content.match(/```json\n([\s\S]*)\n```/s);
      if (match) {
        data = JSON.parse(match[1]);
      } else {
        data = {};
      }
    }

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});
