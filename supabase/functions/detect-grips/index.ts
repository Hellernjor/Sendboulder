
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
    
    // Get Google Vision API key from environment
    const apiKey = Deno.env.get('GOOGLE_VISION_API_KEY')
    
    if (!apiKey) {
      console.error('❌ Google Vision API key not configured');
      // Return mock data as fallback
      const mockGrips = [
        { x: 0.3, y: 0.4, confidence: 0.85, name: "crimp" },
        { x: 0.6, y: 0.5, confidence: 0.92, name: "jug" },
        { x: 0.45, y: 0.7, confidence: 0.78, name: "pinch" }
      ];
      
      return new Response(
        JSON.stringify({ grips: mockGrips }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        },
      )
    }

    console.log('🔑 Using Google Vision API for grip detection');

    // Prepare the request to Google Vision API
    const visionRequest = {
      requests: [{
        image: {
          content: image.split(',')[1] // Remove data:image/jpeg;base64, prefix
        },
        features: [{
          type: 'OBJECT_LOCALIZATION',
          maxResults: 50
        }]
      }]
    }

    // Call Google Vision API
    const response = await fetch(
      `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(visionRequest)
      }
    )

    const visionData = await response.json()
    
    if (!response.ok) {
      console.error('❌ Vision API error:', visionData);
      throw new Error(`Vision API error: ${JSON.stringify(visionData)}`)
    }

    // Process the results to find potential climbing holds
    const objects = visionData.responses[0]?.localizedObjectAnnotations || []
    console.log('🔍 Found objects:', objects.length);
    
    // Filter for objects that could be climbing holds
    const potentialGrips = objects
      .filter((obj: any) => {
        // Look for objects that might be holds (circular, rectangular shapes, etc.)
        const name = obj.name.toLowerCase()
        return obj.score > 0.3 && (
          name.includes('circle') ||
          name.includes('button') ||
          name.includes('knob') ||
          name.includes('handle') ||
          name.includes('grip') ||
          name.includes('hold') ||
          name.includes('rock') ||
          name.includes('stone')
        )
      })
      .map((obj: any) => {
        const vertices = obj.boundingPoly.normalizedVertices
        // Calculate center point from bounding box
        const centerX = (vertices[0].x + vertices[2].x) / 2
        const centerY = (vertices[0].y + vertices[2].y) / 2
        
        return {
          x: centerX,
          y: centerY,
          confidence: obj.score,
          name: obj.name
        }
      })

    console.log('✅ Detected grips:', potentialGrips.length);

    return new Response(
      JSON.stringify({ grips: potentialGrips }),
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
