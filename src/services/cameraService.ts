
export class CameraService {
  private stream: MediaStream | null = null;
  private videoElement: HTMLVideoElement | null = null;

  async requestCameraAccess(): Promise<{ success: boolean; error?: string }> {
    try {
      console.log('Requesting camera access...');
      
      // Check if getUserMedia is available
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        return { success: false, error: 'Camera API not supported in this browser' };
      }

      // Simple, direct camera request
      const constraints = {
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      };

      this.stream = await navigator.mediaDevices.getUserMedia(constraints);
      console.log('Camera access granted successfully');
      return { success: true };
    } catch (error: any) {
      console.error('Camera access error:', error);
      
      // Handle specific error types
      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        return { 
          success: false, 
          error: 'Camera access was denied. Please allow camera access in your browser settings.' 
        };
      }
      
      if (error.name === 'NotFoundError') {
        return { 
          success: false, 
          error: 'No camera found on this device.' 
        };
      }
      
      return { 
        success: false, 
        error: `Camera error: ${error.message}` 
      };
    }
  }

  attachToVideo(videoElement: HTMLVideoElement) {
    if (this.stream && videoElement) {
      this.videoElement = videoElement;
      videoElement.srcObject = this.stream;
      videoElement.play().catch(err => {
        console.error('Error playing video:', err);
      });
      console.log('Video stream attached successfully');
    }
  }

  stopCamera() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
      console.log('Camera stopped');
    }
    if (this.videoElement) {
      this.videoElement.srcObject = null;
    }
  }

  captureFrame(): string | null {
    if (!this.videoElement) return null;
    
    const canvas = document.createElement('canvas');
    canvas.width = this.videoElement.videoWidth;
    canvas.height = this.videoElement.videoHeight;
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(this.videoElement, 0, 0);
      return canvas.toDataURL('image/jpeg', 0.8);
    }
    
    return null;
  }

  async switchCamera() {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const videoDevices = devices.filter(device => device.kind === 'videoinput');
    
    if (videoDevices.length > 1) {
      this.stopCamera();
      return this.requestCameraAccess();
    }
    return { success: false, error: 'No other cameras available' };
  }

  isIOSDevice(): boolean {
    return /iPad|iPhone|iPod/.test(navigator.userAgent);
  }
}
