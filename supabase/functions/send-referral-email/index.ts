
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ReferralRequest {
  firstName: string;
  lastName: string;
  email: string;
  referrerName: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { firstName, lastName, email, referrerName }: ReferralRequest = await req.json();
    
    // Get the application URL from environment variable or use a default
    const appUrl = Deno.env.get("APP_URL") || "https://aluminsights.lovable.app";
    const signupUrl = `${appUrl}/auth?role=mentor&ref=referral`;

    const emailResponse = await resend.emails.send({
      from: "AlumniSights <invitations@aluminsights.lovable.app>", // Updated to use a lovable domain
      to: [email],
      subject: `${referrerName} invites you to join AlumniSights as a mentor`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Hello ${firstName},</h2>
          <p>${referrerName} thinks you would be a great mentor on AlumniSights!</p>
          <p>AlumniSights connects alumni with current students and applicants to provide mentorship and guidance.</p>
          <p>As a mentor, you can:</p>
          <ul>
            <li>Share your experience and insights</li>
            <li>Help students with their academic and career decisions</li>
            <li>Build your professional network</li>
          </ul>
          <div style="margin: 30px 0;">
            <a href="${signupUrl}" style="background-color: #9b87f5; color: white; padding: 12px 20px; text-decoration: none; border-radius: 4px; font-weight: bold;">Join as a Mentor</a>
          </div>
          <p>Looking forward to having you on board!</p>
          <p>Best regards,<br>AlumniSights Team</p>
        </div>
      `,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-referral-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
