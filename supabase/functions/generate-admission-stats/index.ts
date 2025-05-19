
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { universityName } = await req.json();
    
    if (!universityName) {
      return new Response(
        JSON.stringify({ error: 'University name is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    
    if (!openAIApiKey) {
      return new Response(
        JSON.stringify({ error: 'OpenAI API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Make a request to OpenAI to generate admission statistics
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { 
            role: 'system', 
            content: `You are an AI that provides accurate admission statistics for universities. 
                     Provide only the acceptance rate (%), average SAT score (on a scale of 400-1600), 
                     and average ACT score (on a scale of 1-36) for the requested university. 
                     Use the most recent publicly available data.
                     Return your answer in JSON format with the fields: acceptanceRate, averageSAT, averageACT.
                     If you're not certain about a value, return null for that field.`
          },
          { 
            role: 'user', 
            content: `What are the admission statistics for ${universityName}?` 
          }
        ],
        response_format: { type: "json_object" }
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`OpenAI API error: ${error.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    // Parse the JSON string from the content
    try {
      const stats = JSON.parse(content);
      
      // Extract and validate the values
      const acceptanceRate = stats.acceptanceRate !== undefined ? 
        parseFloat(stats.acceptanceRate) : null;
      const averageSAT = stats.averageSAT !== undefined ? 
        parseFloat(stats.averageSAT) : null;
      const averageACT = stats.averageACT !== undefined ? 
        parseFloat(stats.averageACT) : null;
      
      return new Response(
        JSON.stringify({
          acceptanceRate,
          averageSAT,
          averageACT,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } catch (error) {
      console.error("Error parsing OpenAI response:", error);
      return new Response(
        JSON.stringify({ error: "Failed to parse admission statistics" }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error("Error in generate-admission-stats function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
