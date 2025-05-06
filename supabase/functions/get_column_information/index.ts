
// This edge function checks if a column exists in a table
// It's needed to handle backward compatibility when the zoom_link column might not exist
// @ts-ignore
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

/**
 * Function that checks if a column exists in a database table
 */
serve(async (req) => {
  try {
    // Create a Supabase client with the service role key
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );
    
    // Get parameters from request
    let params;
    try {
      params = await req.json();
    } catch (e) {
      return new Response(
        JSON.stringify({ error: "Invalid JSON in request body" }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    const { table_name, column_name } = params;
    
    // Validate parameters
    if (!table_name || !column_name || typeof table_name !== 'string' || typeof column_name !== 'string') {
      return new Response(
        JSON.stringify({ error: "Missing or invalid table_name or column_name parameters" }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Query the information_schema to check if the column exists
    const { data, error } = await supabaseClient
      .from('information_schema.columns')
      .select('column_name')
      .eq('table_name', table_name)
      .eq('column_name', column_name)
      .eq('table_schema', 'public');
      
    if (error) {
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    return new Response(
      JSON.stringify(data),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});
