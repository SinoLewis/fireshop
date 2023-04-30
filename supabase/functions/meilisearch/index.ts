import { json, serve } from "https://deno.land/std@0.168.0/http/server.ts";
import axiod from "https://deno.land/x/axiod/mod.ts";
import { corsHeaders } from "../_shared/cors.ts";

console.log(`Function "meilisearch" up and running!`);

serve(async (req) => {
  const NGROK_URL = Deno.env.get("NGROK_URL")!;

  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { query } = await req.json();
    const { data } = await axiod.get(`${NGROK_URL}/meilisearch/${query}`);

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
