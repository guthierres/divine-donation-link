import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface PaymentRequest {
  campaign_id: string;
  parish_id: string;
  donor_name: string;
  donor_email: string;
  donor_phone?: string;
  amount: number;
  payment_method: "credit_card" | "pix" | "boleto";
  anonymous?: boolean;
  message?: string;
  card_data?: {
    number: string;
    holder_name: string;
    exp_month: string;
    exp_year: string;
    cvv: string;
  };
}

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

    const paymentData: PaymentRequest = await req.json();

    const { campaign_id, parish_id, donor_name, donor_email, donor_phone, amount, payment_method, anonymous, message, card_data } = paymentData;

    if (!campaign_id || !parish_id || !donor_name || !donor_email || !amount || !payment_method) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const { data: parish, error: parishError } = await supabase
      .from("parishes")
      .select("pagarme_secret_key, pagarme_configured")
      .eq("id", parish_id)
      .maybeSingle();

    if (parishError || !parish) {
      return new Response(
        JSON.stringify({ error: "Parish not found" }),
        {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    if (!parish.pagarme_configured || !parish.pagarme_secret_key) {
      return new Response(
        JSON.stringify({ error: "Payment gateway not configured for this parish" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const amountInCents = Math.round(amount * 100);

    let pagarmePayload: any = {
      amount: amountInCents,
      payment_method: payment_method,
      customer: {
        name: donor_name,
        email: donor_email,
        ...(donor_phone && { phones: { mobile_phone: { country_code: "55", area_code: donor_phone.substring(0, 2), number: donor_phone.substring(2) } } }),
      },
      metadata: {
        campaign_id,
        parish_id,
        anonymous: anonymous || false,
        ...(message && { message }),
      },
    };

    if (payment_method === "credit_card" && card_data) {
      pagarmePayload.card = {
        number: card_data.number.replace(/\s/g, ""),
        holder_name: card_data.holder_name,
        exp_month: parseInt(card_data.exp_month),
        exp_year: parseInt(card_data.exp_year),
        cvv: card_data.cvv,
      };
    } else if (payment_method === "pix") {
      pagarmePayload.pix = {
        expires_in: 3600,
      };
    } else if (payment_method === "boleto") {
      pagarmePayload.boleto = {
        instructions: "Pagamento referente a doação",
        due_at: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      };
    }

    const pagarmeResponse = await fetch("https://api.pagar.me/core/v5/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${parish.pagarme_secret_key}`,
      },
      body: JSON.stringify({
        items: [{
          amount: amountInCents,
          description: "Doação para campanha",
          quantity: 1,
        }],
        payments: [pagarmePayload],
      }),
    });

    const pagarmeResult = await pagarmeResponse.json();

    if (!pagarmeResponse.ok) {
      console.error("Pagar.me error:", pagarmeResult);
      return new Response(
        JSON.stringify({ error: "Payment processing failed", details: pagarmeResult }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const transactionId = pagarmeResult.id;
    let initialStatus = "pending";

    if (pagarmeResult.status === "paid") {
      initialStatus = "paid";
    } else if (pagarmeResult.status === "processing") {
      initialStatus = "processing";
    }

    const { data: donation, error: donationError } = await supabase
      .from("donations")
      .insert({
        campaign_id,
        parish_id,
        donor_name,
        donor_email,
        donor_phone,
        amount,
        payment_method,
        status: initialStatus,
        transaction_id: transactionId,
        pagarme_response: pagarmeResult,
        anonymous: anonymous || false,
        message: message || null,
      })
      .select()
      .single();

    if (donationError) {
      console.error("Error saving donation:", donationError);
      return new Response(
        JSON.stringify({ error: "Error saving donation" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    let paymentDetails: any = {
      donation_id: donation.id,
      transaction_id: transactionId,
      status: initialStatus,
    };

    if (payment_method === "pix" && pagarmeResult.charges?.[0]?.last_transaction?.qr_code) {
      paymentDetails.pix_qr_code = pagarmeResult.charges[0].last_transaction.qr_code;
      paymentDetails.pix_qr_code_url = pagarmeResult.charges[0].last_transaction.qr_code_url;
    } else if (payment_method === "boleto" && pagarmeResult.charges?.[0]?.last_transaction?.url) {
      paymentDetails.boleto_url = pagarmeResult.charges[0].last_transaction.url;
      paymentDetails.boleto_barcode = pagarmeResult.charges[0].last_transaction.line;
    }

    return new Response(
      JSON.stringify({
        success: true,
        ...paymentDetails,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Payment processing error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
