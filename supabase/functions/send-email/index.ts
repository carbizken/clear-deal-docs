import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Supports Resend (recommended) or SendGrid
// Set RESEND_API_KEY or SENDGRID_API_KEY in Supabase secrets

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { to, subject, html, from, replyTo, attachments } = await req.json();

    if (!to || !subject) {
      return new Response(
        JSON.stringify({ error: "to and subject required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const resendKey = Deno.env.get("RESEND_API_KEY");
    const sendgridKey = Deno.env.get("SENDGRID_API_KEY");

    if (resendKey) {
      // Resend API
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${resendKey}` },
        body: JSON.stringify({
          from: from || "Autocurb <noreply@autocurb.io>",
          to: Array.isArray(to) ? to : [to],
          subject,
          html,
          reply_to: replyTo,
          attachments,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        return new Response(JSON.stringify({ error: "Resend error", details: data }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      return new Response(JSON.stringify({ success: true, id: data.id }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    if (sendgridKey) {
      // SendGrid API
      const res = await fetch("https://api.sendgrid.com/v3/mail/send", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${sendgridKey}` },
        body: JSON.stringify({
          personalizations: [{ to: Array.isArray(to) ? to.map((e: string) => ({ email: e })) : [{ email: to }] }],
          from: { email: from || "noreply@autocurb.io", name: "Autocurb" },
          subject,
          content: [{ type: "text/html", value: html }],
        }),
      });
      if (!res.ok) {
        const text = await res.text();
        return new Response(JSON.stringify({ error: "SendGrid error", details: text }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      return new Response(JSON.stringify({ success: true }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    return new Response(
      JSON.stringify({ error: "No email provider configured. Set RESEND_API_KEY or SENDGRID_API_KEY in Supabase secrets." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return new Response(JSON.stringify({ error: msg }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
