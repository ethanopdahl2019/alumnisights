
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.26.0";

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
    // Create a Supabase client with the Auth context of the logged-in user
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
          detectSessionInUrl: false,
        },
      }
    );

    // Get auth token from the request header
    const authHeader = req.headers.get('Authorization')!;
    supabaseClient.auth.setAuth(authHeader.replace('Bearer ', ''));

    // Get the request body
    const { university_id, acceptance_rate, average_sat, average_act } = await req.json();

    if (!university_id) {
      return new Response(JSON.stringify({ error: "University ID is required" }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    // First check if record exists
    const { data: existingData, error: selectError } = await supabaseClient
      .from('universities_admission_stats')
      .select('university_id')
      .eq('university_id', university_id)
      .single();

    if (selectError && selectError.code !== 'PGRST116') { // PGRST116 is "no rows returned" error
      throw selectError;
    }

    let result;
    if (!existingData) {
      // Insert new record
      result = await supabaseClient
        .from('universities_admission_stats')
        .insert({
          university_id,
          acceptance_rate,
          average_sat,
          average_act
        });
    } else {
      // Update existing record
      result = await supabaseClient
        .from('universities_admission_stats')
        .update({
          acceptance_rate,
          average_sat,
          average_act,
          updated_at: new Date().toISOString()
        })
        .eq('university_id', university_id);
    }

    if (result.error) {
      throw result.error;
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
