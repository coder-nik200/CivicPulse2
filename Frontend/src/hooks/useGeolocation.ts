"use client";

import { useState, useCallback } from "react";

interface Location {
  latitude: number;
  longitude: number;
  accuracy?: number;
  address?: string;
}

interface UseGeolocationReturn {
  location: Location | null;
  loading: boolean;
  error: string | null;
  getLocation: () => Promise<Location | null>;
  clearLocation: () => void;
}

export function useGeolocation(): UseGeolocationReturn {
  const [location, setLocation] = useState<Location | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getLocation = useCallback(async (): Promise<Location | null> => {
    try {
      setError(null);
      setLoading(true);

      if (!navigator.geolocation) {
        throw new Error("Geolocation is not supported in this browser");
      }

      return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude, accuracy } = position.coords;
            const newLocation: Location = {
              latitude,
              longitude,
              accuracy,
            };

            // Try to get reverse geocoding (optional)
            try {
              const address = await reverseGeocode(latitude, longitude);
              newLocation.address = address;
            } catch (err) {
              // Silently fail reverse geocoding, still return location
              console.warn("Reverse geocoding failed:", err);
            }

            setLocation(newLocation);
            resolve(newLocation);
          },
          (err) => {
            let message = "Failed to get location";
            if (err.code === err.PERMISSION_DENIED) {
              message =
                "Location permission denied. Please enable location access.";
            } else if (err.code === err.POSITION_UNAVAILABLE) {
              message = "Location information is unavailable.";
            } else if (err.code === err.TIMEOUT) {
              message = "Location request timed out.";
            }
            setError(message);
            reject(new Error(message));
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0,
          },
        );
      });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to get location";
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearLocation = useCallback(() => {
    setLocation(null);
    setError(null);
  }, []);

  return {
    location,
    loading,
    error,
    getLocation,
    clearLocation,
  };
}

// Reverse geocoding function (using OpenStreetMap nominatim as fallback)
async function reverseGeocode(
  latitude: number,
  longitude: number,
): Promise<string> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
      {
        headers: {
          Accept: "application/json",
        },
      },
    );

    if (!response.ok) throw new Error("Reverse geocoding failed");

    const data: any = await response.json();
    return (
      data.address?.road || data.address?.city || `${latitude}, ${longitude}`
    );
  } catch (err) {
    // Return coordinates if geocoding fails
    return `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
  }
}
