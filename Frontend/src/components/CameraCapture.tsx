"use client";

import { useState, useEffect, useRef } from "react";
import { useCamera } from "@/hooks/useCamera";
import { Camera, X, RotateCw, Check, Upload, AlertCircle } from "lucide-react";
import { Button } from "@/components/common/inputs";
import { Alert, Spinner } from "@/components/common";

interface CameraCaptureProps {
  onCapture: (imageData: string) => void;
  onCancel: () => void;
}

export function CameraCapture({ onCapture, onCancel }: CameraCaptureProps) {
  const camera = useCamera();
  const [showPreview, setShowPreview] = useState(false);
  const [facingMode, setFacingMode] = useState<"environment" | "user">(
    "environment",
  );

  useEffect(() => {
    camera.startCamera();
    return () => camera.stopCamera();
  }, []);

  const handleCapture = () => {
    const image = camera.capturePhoto();
    if (image) {
      setShowPreview(true);
    }
  };

  const handleConfirm = () => {
    if (camera.capturedImage) {
      onCapture(camera.capturedImage);
      camera.stopCamera();
    }
  };

  const handleRetake = () => {
    camera.clearCapture();
    setShowPreview(false);
  };

  const handleToggleCamera = async () => {
    camera.stopCamera();
    const newMode = facingMode === "environment" ? "user" : "environment";
    setFacingMode(newMode);

    // Reinitialize camera with new facing mode
    setTimeout(() => {
      camera.startCamera();
    }, 300);
  };

  if (!showPreview && camera.isCapturing) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col bg-black">
        <div className="flex-1 overflow-hidden">
          <video
            ref={camera.videoRef}
            className="h-full w-full object-cover"
            autoPlay
            playsInline
            onLoadedMetadata={() => {
              if (camera.videoRef.current) {
                camera.videoRef.current.play();
              }
            }}
          />
          <canvas ref={camera.canvasRef} className="hidden" />
        </div>

        {camera.error && (
          <div className="bg-black p-4">
            <Alert variant="error">{camera.error}</Alert>
          </div>
        )}

        {/* Camera Controls */}
        <div className="bg-gradient-to-t from-black via-black/80 to-transparent px-6 py-8">
          <div className="flex items-center justify-center gap-4">
            {/* Close Button */}
            <button
              onClick={onCancel}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition hover:bg-white/20"
              aria-label="Close camera"
            >
              <X size={24} />
            </button>

            {/* Capture Button */}
            <button
              onClick={handleCapture}
              className="flex h-16 w-16 items-center justify-center rounded-full bg-teal-500 text-white shadow-lg transition hover:bg-teal-600 active:scale-95"
              aria-label="Take photo"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-white" />
            </button>

            {/* Toggle Camera Button */}
            <button
              onClick={handleToggleCamera}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition hover:bg-white/20"
              aria-label="Switch camera"
            >
              <RotateCw size={24} />
            </button>
          </div>

          {/* Hint Text */}
          <p className="mt-6 text-center text-sm text-white/70">
            Position the issue clearly in the frame for best results
          </p>
        </div>
      </div>
    );
  }

  if (showPreview && camera.capturedImage) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col bg-black">
        {/* Image Preview */}
        <div className="flex-1 flex items-center justify-center overflow-hidden p-4">
          <img
            src={camera.capturedImage}
            alt="Captured"
            className="max-h-full max-w-full rounded-xl object-contain"
          />
        </div>

        {/* Preview Controls */}
        <div className="bg-gradient-to-t from-black via-black/80 to-transparent px-6 py-8">
          <div className="space-y-4">
            <div className="flex gap-3">
              <Button
                variant="secondary"
                size="lg"
                onClick={handleRetake}
                className="flex-1"
              >
                <RotateCw size={18} className="mr-2" />
                Retake
              </Button>
              <Button
                variant="primary"
                size="lg"
                onClick={handleConfirm}
                className="flex-1"
              >
                <Check size={18} className="mr-2" />
                Use Photo
              </Button>
            </div>
            <p className="text-center text-sm text-white/70">
              This photo will be used to report the civic issue
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!camera.isCapturing && !showPreview) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black p-4">
        <Spinner size="lg" />
        <p className="mt-4 text-white">Initializing camera...</p>
      </div>
    );
  }

  return null;
}

// Gallery Upload Component
interface GalleryUploadProps {
  onUpload: (imageData: string) => void;
  accept?: string;
}

export function GalleryUpload({
  onUpload,
  accept = "image/*",
}: GalleryUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      onUpload(result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
      />
      <Button
        variant="outline"
        onClick={() => fileInputRef.current?.click()}
        className="w-full"
      >
        <Upload size={18} className="mr-2" />
        Upload from Gallery
      </Button>
    </>
  );
}

// Image Capture Modal with both camera and gallery options
interface ImageCaptureModalProps {
  onCapture: (imageData: string) => void;
  onCancel: () => void;
}

export function ImageCaptureModal({
  onCapture,
  onCancel,
}: ImageCaptureModalProps) {
  const [mode, setMode] = useState<"select" | "camera" | "gallery">("select");

  if (mode === "camera") {
    return (
      <CameraCapture onCapture={onCapture} onCancel={() => setMode("select")} />
    );
  }

  if (mode === "gallery") {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
        <div className="w-full max-w-sm rounded-2xl bg-white p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-4">
            Choose Source
          </h2>
          <GalleryUpload onUpload={onCapture} />
          <button
            onClick={() => setMode("select")}
            className="mt-3 w-full rounded-lg border border-slate-200 px-4 py-2 text-slate-900 transition hover:bg-slate-50"
          >
            Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-900">
            Capture Issue Photo
          </h2>
          <button
            onClick={onCancel}
            className="rounded-lg p-1 text-slate-500 hover:bg-slate-100"
          >
            <X size={20} />
          </button>
        </div>

        <p className="mb-6 text-sm text-slate-600">
          Take a clear photo of the civic issue or upload from your gallery
        </p>

        <div className="space-y-3">
          <Button
            variant="primary"
            size="lg"
            onClick={() => setMode("camera")}
            className="w-full"
          >
            <Camera size={18} className="mr-2" />
            Take Photo
          </Button>
          <GalleryUpload onUpload={onCapture} />
        </div>

        <button
          onClick={onCancel}
          className="mt-4 w-full rounded-lg border border-slate-200 px-4 py-2.5 text-slate-900 font-medium transition hover:bg-slate-50"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
