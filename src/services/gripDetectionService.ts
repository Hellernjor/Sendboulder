
import { supabase } from '@/lib/supabase';

export interface DetectedGrip {
  x: number;
  y: number;
  confidence: number;
  name?: string;
}

export class GripDetectionService {
  static async detectGrips(imageDataUrl: string): Promise<DetectedGrip[]> {
    try {
      console.log('Calling grip detection service...');
      console.log('Image data URL length:', imageDataUrl.length);
      
      const { data, error } = await supabase.functions.invoke('detect-grips', {
        body: { 
          image: imageDataUrl 
        }
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(`Grip detection failed: ${error.message}`);
      }

      if (!data || !data.grips) {
        console.warn('No grips detected in response');
        return [];
      }

      console.log(`Detected ${data.grips.length} potential grips`);
      return data.grips;

    } catch (error) {
      console.error('Error detecting grips:', error);
      // Return empty array instead of throwing to keep the UI working
      return [];
    }
  }
}
