
'use client';

import React, { useRef, useState, useCallback } from 'react';
import Webcam from 'react-webcam';
import { Button } from './ui/button';
import { Camera, Check, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { AlertCircle } from 'lucide-react';

const videoConstraints = {
  width: 1280,
  height: 720,
  facingMode: 'environment', // Use the rear camera on mobile devices
};

type CameraCaptureProps = {
  onPhotoTaken: (dataUri: string) => void;
};

export function CameraCapture({ onPhotoTaken }: CameraCaptureProps) {
  const webcamRef = useRef<Webcam>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleUserMediaError = () => {
    setCameraError('Camera access was denied or is not available. Please check your browser permissions.');
    toast({
        variant: 'destructive',
        title: 'Camera Error',
        description: 'Could not access the camera. Please ensure permissions are granted in your browser settings.'
    });
  }

  const capture = useCallback(() => {
    if (webcamRef.current) {
      const image = webcamRef.current.getScreenshot();
      setImageSrc(image);
    }
  }, [webcamRef]);

  const retake = () => {
    setImageSrc(null);
  };

  const confirmPhoto = () => {
    if (imageSrc) {
      onPhotoTaken(imageSrc);
    }
  };

  if (cameraError) {
      return (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Camera Access Error</AlertTitle>
            <AlertDescription>{cameraError}</AlertDescription>
          </Alert>
      )
  }

  return (
    <div className="w-full">
      {imageSrc ? (
        <div>
          <img src={imageSrc} alt="Captured" className="rounded-md" />
          <div className="flex justify-center gap-4 mt-4">
            <Button variant="outline" onClick={retake}>
              <RefreshCw className="mr-2 h-4 w-4" /> Retake
            </Button>
            <Button onClick={confirmPhoto}>
              <Check className="mr-2 h-4 w-4" /> Confirm Photo
            </Button>
          </div>
        </div>
      ) : (
        <div className='relative'>
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={videoConstraints}
            className="w-full h-auto rounded-md"
            onUserMediaError={handleUserMediaError}
          />
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
            <Button size="icon" className="w-16 h-16 rounded-full" onClick={capture}>
              <Camera className="h-8 w-8" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
