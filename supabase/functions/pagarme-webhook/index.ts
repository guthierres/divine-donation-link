import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const payload = await req.json();

    console.log("Webhook received:", payload);

    const eventType = payload.type || payload.event;
    const transactionId = payload.id || payload.transaction?.id || payload.data?.id;

    if (!transactionId) {
      return new Response(
        JSON.stringify({ error: "Transaction ID not found" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    let newStatus = "pending";

    switch (eventType) {
      case "charge.paid":
      case "transaction.paid":
      case "payment.paid":
      case "order.paid":
        newStatus = "paid";
        break;
      case "charge.refunded":
      case "transaction.refunded":
      case "payment.refunded":
      case "order.refunded":
        newStatus = "refunded";
        break;
      case "charge.failed":
      case "transaction.failed":
      case "payment.failed":
      case "order.payment_failed":
        newStatus = "failed";
        break;
      case "charge.processing":
      case "transaction.processing":
      case "payment.processing":
      case "order.pending":
        newStatus = "processing";
        break;
      default:
        console.log("Unknown event type:", eventType);
    }

    const { data: donation, error: findError } = await supabase
      .from("donations")
      .select("*")
      .eq("transaction_id", transactionId)
      .maybeSingle();

    if (findError) {
      console.error("Error finding donation:", findError);
      return new Response(
        JSON.stringify({ error: "Error finding donation" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    if (donation) {
      const { error: updateError } = await supabase
        .from("donations")
        .update({
          status: newStatus,
          pagarme_response: payload,
          updated_at: new Date().toISOString(),
        })
        .eq("id", donation.id);

      if (updateError) {
        console.error("Error updating donation:", updateError);
        return new Response(
          JSON.stringify({ error: "Error updating donation" }),
          {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      console.log(`Donation ${donation.id} updated to status: ${newStatus}`);
    } else {
      console.log("Donation not found for transaction:", transactionId);
    }

    return new Response(
      JSON.stringify({ success: true, status: newStatus }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Webhook error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
