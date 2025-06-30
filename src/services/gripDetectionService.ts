import { supabase } from '@/lib/supabase';
import { Logger } from '@/lib/logger';

export interface DetectedGrip {
  x: number;
  y: number;
  confidence: number;
  name?: string;
}

export class GripDetectionService {
  static async detectGrips(imageDataUrl: string): Promise<DetectedGrip[]> {
    Logger.network('GripDetectionService', 'Starting grip detection API call', {
      imageLength: imageDataUrl.length,
      imageType: imageDataUrl.substring(0, 50)
    });
    
    try {
      const { data, error } = await supabase.functions.invoke('detect-grips', {
        body: { 
          image: imageDataUrl 
        }
      });

      Logger.network('GripDetectionService', 'Grip detection API response', {
        hasData: !!data,
        hasError: !!error,
        errorMessage: error?.message
      });

      if (error) {
        Logger.error('GripDetectionService', 'Supabase function error', error);
        throw new Error(`Hold detection failed: ${error.message}`);
      }

      if (!data || !data.grips) {
        Logger.warn('GripDetectionService', 'No grips in response', data);
        return [];
      }

      Logger.success('GripDetectionService', `Successfully detected ${data.grips.length} grips`, {
        grips: data.grips,
        confidence: data.grips.map((g: DetectedGrip) => g.confidence)
      });
      
      return data.grips;

    } catch (error) {
      Logger.error('GripDetectionService', 'Grip detection service error', error);
      // Return empty array instead of throwing to keep the UI working
      return [];
    }
  }
}
