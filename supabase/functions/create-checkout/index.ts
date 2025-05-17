
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import Stripe from "https://esm.sh/stripe@12.18.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { profileId, productId, selectedDate, selectedTime, userId } = body;

    if (!profileId || !productId || !selectedDate || !selectedTime || !userId) {
      return new Response(
        JSON.stringify({ error: "Missing required booking information" }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    // Create Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Missing Supabase environment variables");
    }
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false }
    });

    // Retrieve profile information and product details
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("name")
      .eq("id", profileId)
      .single();

    if (profileError || !profileData) {
      return new Response(
        JSON.stringify({ error: `Error fetching profile: ${profileError?.message || "Not found"}` }),
        { 
          status: 404, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    // Find the selected product based on the product ID
    let productPrice = 0;
    let productTitle = "";
    let productDuration = "";

    if (productId === "quick-chat") {
      const { data: profile } = await supabase
        .from("profiles")
        .select("price_15_min")
        .eq("id", profileId)
        .single();
      
      productPrice = profile?.price_15_min || 0;
      productTitle = "Quick Chat";
      productDuration = "15 minutes";
    } else if (productId === "deep-dive") {
      const { data: profile } = await supabase
        .from("profiles")
        .select("price_30_min")
        .eq("id", profileId)
        .single();
      
      productPrice = profile?.price_30_min || 0;
      productTitle = "Deep Dive";
      productDuration = "30 minutes";
    } else if (productId === "comprehensive") {
      const { data: profile } = await supabase
        .from("profiles")
        .select("price_60_min")
        .eq("id", profileId)
        .single();
      
      productPrice = profile?.price_60_min || 0;
      productTitle = "Comprehensive Session";
      productDuration = "60 minutes";
    }

    if (!productPrice) {
      return new Response(
        JSON.stringify({ error: "Product not found or price not available" }),
        { 
          status: 404, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    // Parse the selected date and time
    const timeMatch = selectedTime.match(/^(\d+):(\d+) (AM|PM)$/);
    if (!timeMatch) {
      return new Response(
        JSON.stringify({ error: "Invalid time format" }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }
    
    const [_, hours, minutes, period] = timeMatch;
    const isPM = period === 'PM';
    const hoursInt = parseInt(hours);
    
    // Convert to 24 hour format
    const adjustedHours = isPM && hoursInt !== 12 
      ? hoursInt + 12 
      : (isPM && hoursInt === 12 ? 12 : hoursInt === 12 ? 0 : hoursInt);
    
    const scheduledDateTime = new Date(selectedDate);
    scheduledDateTime.setHours(adjustedHours);
    scheduledDateTime.setMinutes(parseInt(minutes));

    // Create a temporary booking record with pending status
    const { data: bookingData, error: bookingError } = await supabase
      .from("bookings")
      .insert({
        user_id: userId,
        profile_id: profileId,
        scheduled_at: scheduledDateTime.toISOString(),
        status: "pending",
      })
      .select()
      .single();

    if (bookingError) {
      return new Response(
        JSON.stringify({ error: `Error creating booking: ${bookingError.message}` }),
        { 
          status: 500, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    // Initialize Stripe
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      throw new Error("Missing Stripe secret key");
    }
    
    const stripe = new Stripe(stripeKey, {
      apiVersion: "2023-10-16",
    });

    // Create a Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `${productTitle} with ${profileData.name}`,
              description: `${productDuration} session on ${scheduledDateTime.toLocaleString()}`,
            },
            unit_amount: productPrice * 100, // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${req.headers.get("origin")}/booking-success/${bookingData.id}`,
      cancel_url: `${req.headers.get("origin")}/booking-canceled/${bookingData.id}`,
      metadata: {
        booking_id: bookingData.id,
      },
    });

    // Update booking with stripe session ID
    await supabase
      .from("bookings")
      .update({ 
        payment_status: "awaiting_payment",
        stripe_session_id: session.id 
      })
      .eq("id", bookingData.id);

    return new Response(
      JSON.stringify({ 
        success: true, 
        checkoutUrl: session.url,
        bookingId: bookingData.id
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Stripe checkout error:", errorMessage);
    
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
