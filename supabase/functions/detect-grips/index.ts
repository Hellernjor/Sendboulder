
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
    console.log('🔍 detect-grips function called');
    
    const { image } = await req.json()
    console.log('📝 Received image data, length:', image ? image.length : 0);
    
    // For now, return mock data since no actual AI service is configured
    // This can be extended later to use actual computer vision APIs
    const mockGrips = [
      { x: 100, y: 150, confidence: 0.85, name: "crimp" },
      { x: 200, y: 250, confidence: 0.92, name: "jug" },
      { x: 150, y: 300, confidence: 0.78, name: "pinch" }
    ];

    console.log('✅ Returning mock grips:', mockGrips.length);

    return new Response(
      JSON.stringify({ grips: mockGrips }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('❌ Error in detect-grips function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})
