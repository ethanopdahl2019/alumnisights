
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

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
    // Create Supabase client using the anon key for user authentication
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    // Retrieve authenticated user
    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data } = await supabaseClient.auth.getUser(token);
    const user = data.user;
    
    if (!user?.email) {
      throw new Error("User not authenticated or email not available");
    }

    // Parse the request body to get booking details
    const requestData = await req.json();
    const { profileId, productId, selectedDate, selectedTime } = requestData;
    
    if (!profileId || !productId || !selectedDate || !selectedTime) {
      throw new Error("Missing required booking information");
    }

    // Fetch the mentor/profile details to get price information
    const { data: profile, error: profileError } = await supabaseClient
      .from("profiles")
      .select("*")
      .eq("id", profileId)
      .single();
    
    if (profileError || !profile) {
      throw new Error("Failed to retrieve mentor profile");
    }

    // Determine the price based on the product selected
    let priceAmount = 0;
    let productTitle = "";
    let productDuration = "";
    
    if (productId === "quick-chat" && profile.price_15_min) {
      priceAmount = profile.price_15_min;
      productTitle = "Quick Chat";
      productDuration = "15 minutes";
    } else if (productId === "deep-dive" && profile.price_30_min) {
      priceAmount = profile.price_30_min;
      productTitle = "Deep Dive";
      productDuration = "30 minutes";
    } else if (productId === "comprehensive" && profile.price_60_min) {
      priceAmount = profile.price_60_min;
      productTitle = "Comprehensive Session";
      productDuration = "60 minutes";
    } else {
      throw new Error("Invalid product selection");
    }

    // Initialize Stripe with the secret key
    const stripe = new Stripe(Deno.env.get("STRIPE_API_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    // Check if a Stripe customer record exists for this user
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    let customerId;
    
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
    }

    // Create a checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : user.email,
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { 
              name: `${productTitle} with ${profile.name}`,
              description: `${productDuration} session on ${selectedDate} at ${selectedTime}`
            },
            unit_amount: priceAmount * 100, // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${req.headers.get("origin")}/booking-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get("origin")}/booking/${profileId}/${productId}`,
      metadata: {
        profile_id: profileId,
        product_id: productId,
        selected_date: selectedDate,
        selected_time: selectedTime,
        user_id: user.id
      }
    });

    // Return the checkout session URL
    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
