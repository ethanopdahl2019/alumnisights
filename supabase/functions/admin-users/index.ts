
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.4'
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'

// Set up CORS headers for browser access
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders, status: 204 });
  }

  // Get authorization header from the request
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) {
    return new Response(JSON.stringify({ error: 'Authorization header is required' }), 
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 });
  }

  try {
    // Create a Supabase client with the service role key (this has admin privileges)
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Create a regular supabase client with the user's token
    // to validate if the user is authorized
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    // Verify that the user is authenticated
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    
    if (authError || !user) {
      console.error('Authentication error:', authError);
      return new Response(JSON.stringify({ error: 'Unauthorized' }), 
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 });
    }

    // Verify that the user is an admin using user_metadata
    const isAdmin = user?.user_metadata?.role === 'admin';
    
    if (!isAdmin) {
      console.error('Access denied: User is not an admin');
      return new Response(JSON.stringify({ error: 'Forbidden: Admin access required' }), 
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 403 });
    }

    // If the user is authenticated and is an admin, fetch all users
    const { data: adminUsers, error: adminError } = await supabaseAdmin.auth.admin.listUsers();
    
    if (adminError) {
      console.error('Admin API error:', adminError);
      return new Response(JSON.stringify({ error: 'Error fetching users' }), 
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 });
    }

    // Return the users data
    return new Response(
      JSON.stringify(adminUsers),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  } catch (error) {
    console.error('Server error:', error.message);
    return new Response(
      JSON.stringify({ error: 'Server error: ' + error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
})
