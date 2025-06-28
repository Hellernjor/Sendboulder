
export class CameraService {
  private stream: MediaStream | null = null;
  private videoElement: HTMLVideoElement | null = null;

  async requestCameraAccess(): Promise<boolean> {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment', // Back camera preferred
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        },
        audio: false
      });
      return true;
    } catch (error) {
      console.error('Camera access denied:', error);
      return false;
    }
  }

  attachToVideo(videoElement: HTMLVideoElement) {
    if (this.stream && videoElement) {
      this.videoElement = videoElement;
      videoElement.srcObject = this.stream;
      videoElement.play();
    }
  }

  stopCamera() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
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
    return false;
  }
}
