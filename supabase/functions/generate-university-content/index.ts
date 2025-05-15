
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
    const { name } = await req.json();

    if (!name) {
      return new Response(JSON.stringify({ error: "University name required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // Prompt for GPT
    const prompt = `
You are an AI specializing in summarizing university information for admissions-focused guides. For "${name}", generate the following as Markdown strings:

1. **Overview:** A professional, brief overview of the university (what it is known for, brief history, unique features).
2. **Admission Statistics:** Realistic but plausible stats – e.g., acceptance rate, average test scores, and anything else relevant, if unknown, mark as "data unavailable".
3. **Application Requirements:** Typical undergraduate admissions requirements for top US universities.
4. **Alumni Insights:** One or two short, original insights or a quote, e.g., about campus life or opportunities (invented, but plausible).

Respond with a valid JSON object with properties: overview, admissionStats, applicationRequirements, alumniInsights.
`;

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
            content: "You are a helpful university admissions expert.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.5,
        max_tokens: 1200,
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
      const match = content.match(/
/s);
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
