import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { Redis } from 'https://deno.land/x/upstash_redis@v1.19.3/mod.ts'
import axios from "https://deno.land/x/axiod/mod.ts"
import { corsHeaders } from "../_shared/cors.ts";

console.log(`Function "upstash-redis-counter" up and running!`)

async function fetchDirections(start: any, end: any) {
    const ORS_KEY = Deno.env.get('ORS_API')
    const apiResponse = await axios.get(
        `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${ORS_KEY}&start=${start}&end=${end}`
    );
    console.log("Request sent to the API");
    return apiResponse.data;
}

serve(async (req) => {
    // This is needed if you're planning to invoke your function from a browser.
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        let { start, end } = await req.json();
        const cacheKey = `${start}:${end}`;
        let results;
        let isCached = false;

        const redis = new Redis({
            url: Deno.env.get('UPSTASH_REDIS_REST_URL')!,
            token: Deno.env.get('UPSTASH_REDIS_REST_TOKEN')!,
        })
        const cacheResults = await redis.get(cacheKey);
        if (cacheResults) {
            isCached = true;
            results = cacheResults;
        } else {
            results = await fetchDirections(start, end);
            if (results.length === 0) {
                throw "API returned an empty array";
            }
            await redis.set(cacheKey, results);
        }

        const res = {
            fromCache: isCached,
            data: results,
        }
        console.log(`OSR DIRECTION: ${start} searched 🎯`);
        return new Response(JSON.stringify(res), { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 })
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 200 })
    }
})