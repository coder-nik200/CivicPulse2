"use client";

import { useState, useRef, useCallback } from "react";

interface UseCameraReturn {
  stream: MediaStream | null;
  capturedImage: string | null;
  isCapturing: boolean;
  error: string | null;
  startCamera: () => Promise<void>;
  stopCamera: () => void;
  capturePhoto: () => string | null;
  clearCapture: () => void;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
}

export function useCamera(
  facingMode: "user" | "environment" = "environment",
): UseCameraReturn {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const startCamera = useCallback(async () => {
    try {
      setError(null);
      setIsCapturing(true);

      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error("Camera is not supported in this browser");
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      setStream(mediaStream);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        await new Promise((resolve) => {
          videoRef.current!.onloadedmetadata = () => {
            videoRef.current!.play();
            resolve(null);
          };
        });
      }
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to access camera. Please check permissions.";
      setError(message);
      setIsCapturing(false);
    }
  }, [facingMode]);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setIsCapturing(false);
  }, [stream]);

  const capturePhoto = useCallback((): string | null => {
    if (!videoRef.current || !canvasRef.current) return null;

    try {
      const context = canvasRef.current.getContext("2d");
      if (!context) return null;

      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;

      context.drawImage(
        videoRef.current,
        0,
        0,
        videoRef.current.videoWidth,
        videoRef.current.videoHeight,
      );

      const imageData = canvasRef.current.toDataURL("image/jpeg", 0.95);
      setCapturedImage(imageData);
      return imageData;
    } catch (err) {
      setError("Failed to capture photo");
      return null;
    }
  }, []);

  const clearCapture = useCallback(() => {
    setCapturedImage(null);
  }, []);

  return {
    stream,
    capturedImage,
    isCapturing,
    error,
    startCamera,
    stopCamera,
    capturePhoto,
    clearCapture,
    videoRef,
    canvasRef,
  };
}
