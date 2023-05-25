import { serve } from "std/server";
import axios from "axios";
import { corsHeaders } from "../_shared/cors.ts";

console.log(`Function "ors-directions" up and running!`);

serve(async (req) => {
  const NGROK_URL = Deno.env.get("NGROK_URL");

  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { start, end } = await req.json();
    const { data } = await axios.get(`${NGROK_URL}/directions/${start}/${end}`);

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
