
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

      // Stop any existing stream first
      this.stopCamera();

      // Request camera access with fallback constraints
      let constraints: MediaStreamConstraints = {
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      };

      try {
        this.stream = await navigator.mediaDevices.getUserMedia(constraints);
      } catch (error: any) {
        console.log('Failed with environment camera, trying default camera');
        // Fallback to any available camera
        const fallbackConstraints: MediaStreamConstraints = {
          video: { 
            width: { ideal: 1280 },
            height: { ideal: 720 }
          },
          audio: false
        };
        this.stream = await navigator.mediaDevices.getUserMedia(fallbackConstraints);
      }

      console.log('Camera access granted successfully');
      console.log('Stream tracks:', this.stream.getTracks().map(track => ({
        kind: track.kind,
        enabled: track.enabled,
        readyState: track.readyState
      })));

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

      if (error.name === 'NotReadableError') {
        return { 
          success: false, 
          error: 'Camera is already in use by another application.' 
        };
      }
      
      return { 
        success: false, 
        error: `Camera error: ${error.message}` 
      };
    }
  }

  async attachToVideo(videoElement: HTMLVideoElement): Promise<boolean> {
    if (!this.stream) {
      console.error('No stream available to attach');
      return false;
    }

    try {
      this.videoElement = videoElement;
      videoElement.srcObject = this.stream;
      
      // Wait for video to be ready
      await new Promise<void>((resolve, reject) => {
        videoElement.onloadedmetadata = () => {
          console.log('Video metadata loaded');
          resolve();
        };
        videoElement.onerror = (error) => {
          console.error('Video error:', error);
          reject(error);
        };
        
        // Timeout after 10 seconds
        setTimeout(() => {
          reject(new Error('Video loading timeout'));
        }, 10000);
      });

      await videoElement.play();
      console.log('Video stream attached and playing successfully');
      return true;
    } catch (error) {
      console.error('Error attaching video:', error);
      return false;
    }
  }

  stopCamera() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => {
        track.stop();
        console.log('Stopped track:', track.kind);
      });
      this.stream = null;
      console.log('Camera stopped');
    }
    if (this.videoElement) {
      this.videoElement.srcObject = null;
      this.videoElement = null;
    }
  }

  captureFrame(): string | null {
    if (!this.videoElement) {
      console.error('No video element available for capture');
      return null;
    }
    
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

  hasStream(): boolean {
    return this.stream !== null && this.stream.getTracks().length > 0;
  }
}
