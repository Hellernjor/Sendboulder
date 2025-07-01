
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('🔍 get-secrets function called');
    
    const { keys } = await req.json()
    console.log('📝 Requested keys:', keys);
    
    const secrets: Record<string, string> = {}
    
    for (const key of keys) {
      const value = Deno.env.get(key)
      console.log(`🔑 Checking secret: ${key}, found: ${!!value}, length: ${value ? value.length : 0}`);
      if (value) {
        secrets[key] = value
      }
    }

    console.log('✅ Returning secrets:', Object.keys(secrets));

    return new Response(
      JSON.stringify(secrets),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('❌ Error in get-secrets function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})
