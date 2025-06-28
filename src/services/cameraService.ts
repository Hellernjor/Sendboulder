export class CameraService {
  private stream: MediaStream | null = null;
  private videoElement: HTMLVideoElement | null = null;

  async checkCameraPermission(): Promise<string> {
    try {
      // Check if permissions API is available
      if (navigator.permissions) {
        const permission = await navigator.permissions.query({ name: 'camera' as PermissionName });
        console.log('Camera permission status:', permission.state);
        return permission.state; // 'granted', 'denied', or 'prompt'
      }
      return 'unknown';
    } catch (error) {
      console.log('Permissions API not available:', error);
      return 'unknown';
    }
  }

  isIOSDevice(): boolean {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
  }

  async requestCameraAccess(): Promise<{ success: boolean; needsIOSSettings: boolean }> {
    try {
      console.log('Requesting camera access...');
      console.log('User agent:', navigator.userAgent);
      console.log('Is iOS:', this.isIOSDevice());
      console.log('Is secure context:', window.isSecureContext);
      
      // Check if we're on HTTPS or localhost
      const isSecure = location.protocol === 'https:' || location.hostname === 'localhost';
      console.log('Is secure context:', isSecure);
      
      if (!isSecure && location.hostname !== 'localhost') {
        throw new Error('Camera access requires HTTPS');
      }

      // Check if getUserMedia is available
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera API not supported in this browser');
      }

      // Try to get camera access with fallback constraints
      let constraints = {
        video: {
          facingMode: 'environment', // Back camera preferred
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        },
        audio: false
      };

      try {
        this.stream = await navigator.mediaDevices.getUserMedia(constraints);
        console.log('Camera access granted successfully');
        return { success: true, needsIOSSettings: false };
      } catch (error: any) {
        console.log('Failed with environment camera, trying any camera:', error);
        // Fallback to any available camera without facingMode constraint
        const fallbackConstraints = {
          video: {
            width: { ideal: 1920 },
            height: { ideal: 1080 }
          },
          audio: false
        };
        this.stream = await navigator.mediaDevices.getUserMedia(fallbackConstraints);
        console.log('Camera access granted with fallback constraints');
        return { success: true, needsIOSSettings: false };
      }
    } catch (error: any) {
      console.error('Camera access error:', error);
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      
      // Check if this is a permission denial on iOS
      const isIOSPermissionDenied = this.isIOSDevice() && 
        (error.name === 'NotAllowedError' || 
         error.name === 'PermissionDeniedError' ||
         error.message.includes('Permission denied') ||
         error.message.includes('permission denied'));

      console.log('iOS permission denied:', isIOSPermissionDenied);
      
      return { 
        success: false, 
        needsIOSSettings: isIOSPermissionDenied 
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
      // Logic to switch between cameras would go here
      return this.requestCameraAccess();
    }
    return { success: false, needsIOSSettings: false };
  }
}
