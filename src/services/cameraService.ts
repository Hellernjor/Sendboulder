
export class CameraService {
  private stream: MediaStream | null = null;
  private videoElement: HTMLVideoElement | null = null;

  async requestCameraAccess(): Promise<{ success: boolean; error?: string }> {
    try {
      console.log('Requesting camera access...');
      console.log('User agent:', navigator.userAgent);
      console.log('Location protocol:', window.location.protocol);
      
      // Check if getUserMedia is available
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        console.error('Camera API not supported');
        return { success: false, error: 'Camera API not supported in this browser. Please use a modern browser like Chrome, Firefox, or Safari.' };
      }

      // Check if we're on HTTPS or localhost
      const isSecure = window.location.protocol === 'https:' || 
                      window.location.hostname === 'localhost' || 
                      window.location.hostname === '127.0.0.1';
      
      if (!isSecure) {
        console.warn('Not on secure connection, camera may not work');
      }

      // Stop any existing stream first
      this.stopCamera();

      // Try multiple constraint combinations
      const constraintOptions = [
        // Try back camera first (mobile)
        {
          video: { 
            facingMode: 'environment',
            width: { ideal: 1280, max: 1920 },
            height: { ideal: 720, max: 1080 }
          },
          audio: false
        },
        // Try any camera
        {
          video: { 
            width: { ideal: 1280, max: 1920 },
            height: { ideal: 720, max: 1080 }
          },
          audio: false
        },
        // Try with minimal constraints
        {
          video: true,
          audio: false
        }
      ];

      let lastError: any = null;
      
      for (const constraints of constraintOptions) {
        try {
          console.log('Trying constraints:', constraints);
          this.stream = await navigator.mediaDevices.getUserMedia(constraints);
          console.log('Camera access granted with constraints:', constraints);
          break;
        } catch (error: any) {
          console.log('Failed with constraints:', constraints, 'Error:', error.message);
          lastError = error;
          continue;
        }
      }

      if (!this.stream) {
        throw lastError || new Error('Failed to access camera with any constraints');
      }

      console.log('Camera access granted successfully');
      console.log('Stream tracks:', this.stream.getTracks().map(track => ({
        kind: track.kind,
        enabled: track.enabled,
        readyState: track.readyState,
        label: track.label
      })));

      return { success: true };
    } catch (error: any) {
      console.error('Camera access error:', error);
      
      // Handle specific error types with more helpful messages
      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        return { 
          success: false, 
          error: 'Camera access was denied. Please allow camera access in your browser and refresh the page.' 
        };
      }
      
      if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
        return { 
          success: false, 
          error: 'No camera found on this device. Please ensure a camera is connected and try again.' 
        };
      }

      if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
        return { 
          success: false, 
          error: 'Camera is already in use by another application. Please close other apps using the camera and try again.' 
        };
      }

      if (error.name === 'OverconstrainedError' || error.name === 'ConstraintNotSatisfiedError') {
        return { 
          success: false, 
          error: 'Camera constraints not supported. Try using a different camera or browser.' 
        };
      }
      
      return { 
        success: false, 
        error: `Camera error: ${error.message || error.name || 'Unknown error'}. Try refreshing the page or using a different browser.` 
      };
    }
  }

  async attachToVideo(videoElement: HTMLVideoElement): Promise<boolean> {
    if (!this.stream) {
      console.error('No stream available to attach');
      return false;
    }

    try {
      console.log('Attaching stream to video element');
      this.videoElement = videoElement;
      videoElement.srcObject = this.stream;
      
      // Set video properties for better mobile experience
      videoElement.setAttribute('playsinline', 'true');
      videoElement.setAttribute('webkit-playsinline', 'true');
      videoElement.muted = true;
      
      // Wait for video to be ready
      await new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('Video loading timeout'));
        }, 15000); // Increased timeout

        videoElement.onloadedmetadata = () => {
          console.log('Video metadata loaded:', {
            videoWidth: videoElement.videoWidth,
            videoHeight: videoElement.videoHeight,
            duration: videoElement.duration
          });
          clearTimeout(timeout);
          resolve();
        };
        
        videoElement.onerror = (error) => {
          console.error('Video error:', error);
          clearTimeout(timeout);
          reject(error);
        };
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
    console.log('Stopping camera...');
    if (this.stream) {
      this.stream.getTracks().forEach(track => {
        track.stop();
        console.log('Stopped track:', track.kind, track.label);
      });
      this.stream = null;
    }
    if (this.videoElement) {
      this.videoElement.srcObject = null;
      this.videoElement = null;
    }
    console.log('Camera stopped');
  }

  captureFrame(): string | null {
    if (!this.videoElement) {
      console.error('No video element available for capture');
      return null;
    }
    
    if (this.videoElement.videoWidth === 0 || this.videoElement.videoHeight === 0) {
      console.error('Video dimensions are zero, cannot capture');
      return null;
    }
    
    try {
      const canvas = document.createElement('canvas');
      canvas.width = this.videoElement.videoWidth;
      canvas.height = this.videoElement.videoHeight;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(this.videoElement, 0, 0);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        console.log('Frame captured successfully');
        return dataUrl;
      }
    } catch (error) {
      console.error('Error capturing frame:', error);
    }
    
    return null;
  }

  async switchCamera() {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      console.log('Available video devices:', videoDevices);
      
      if (videoDevices.length > 1) {
        this.stopCamera();
        return this.requestCameraAccess();
      }
      return { success: false, error: 'No other cameras available on this device' };
    } catch (error) {
      console.error('Error switching camera:', error);
      return { success: false, error: 'Failed to switch camera' };
    }
  }

  isIOSDevice(): boolean {
    return /iPad|iPhone|iPod/.test(navigator.userAgent);
  }

  hasStream(): boolean {
    return this.stream !== null && this.stream.getTracks().length > 0;
  }

  // Add method to check camera permissions
  async checkCameraPermissions(): Promise<{ granted: boolean; error?: string }> {
    try {
      if (!navigator.permissions) {
        return { granted: false, error: 'Permissions API not supported' };
      }
      
      const permission = await navigator.permissions.query({ name: 'camera' as PermissionName });
      console.log('Camera permission status:', permission.state);
      
      return { 
        granted: permission.state === 'granted',
        error: permission.state === 'denied' ? 'Camera permission denied' : undefined
      };
    } catch (error) {
      console.log('Could not check camera permissions:', error);
      return { granted: false, error: 'Could not check permissions' };
    }
  }
}
