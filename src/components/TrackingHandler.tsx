// src/components/TrackingHandler.tsx
import React, { useEffect, useState } from "react";
import { useGeolocation } from "../hooks/useGeolocation";
import { useLocalStorage } from "../hooks/useLocalStorage";
import {
  parseTrackingParams,
  clearTrackingParams,
  createLocationData,
} from "../utils/locationUtils";
import type { LocationData } from "../types";

interface TrackingHandlerProps {
  onLocationTracked?: (locationData: LocationData) => void;
}

const TrackingHandler: React.FC<TrackingHandlerProps> = ({ onLocationTracked }) => {
  const [isTracking, setIsTracking] = useState(false);
  const [trackingStatus, setTrackingStatus] = useState<string>("");
  const [showTracking, setShowTracking] = useState(false);

  const { getCurrentPosition, isLoading, error } = useGeolocation();
  const [trackedLocations, setTrackedLocations] = useLocalStorage<LocationData[]>(
    "trackedLocations",
    []
  );

  useEffect(() => {
    // Check if this is a tracking link when component mounts
    const checkAndTrack = async () => {
      try {
        console.log("Checking for tracking parameters...");

        // Parse tracking parameters from URL
        const { trackId, name } = parseTrackingParams();

        console.log("Parsed params:", { trackId, name });

        if (trackId && name) {
          console.log(`Tracking detected for: ${name} (ID: ${trackId})`);
          setShowTracking(true);
          setIsTracking(true);
          setTrackingStatus("Mendeteksi lokasi...");

          try {
            // Get current location
            console.log("Getting location...");
            const position = await getCurrentPosition();

            console.log("Location obtained:", position);

            // Create location data
            const locationData = createLocationData(name, position);

            console.log("Created location data:", locationData);

            // Save to localStorage
            const updatedLocations = [...trackedLocations, locationData];
            setTrackedLocations(updatedLocations);

            // Call callback if provided
            if (onLocationTracked) {
              onLocationTracked(locationData);
            }

            setTrackingStatus("✅ Lokasi berhasil terdeteksi!");

            // Clean up URL after successful tracking
            setTimeout(() => {
              clearTrackingParams();
              setShowTracking(false);
              console.log("Tracking completed and URL cleaned up");
            }, 3000);
          } catch (locationError) {
            console.error("Location tracking failed:", locationError);
            setTrackingStatus(
              `❌ Gagal mendapatkan lokasi: ${
                locationError instanceof Error ? locationError.message : "Unknown error"
              }`
            );

            // Still clean up URL even if location failed
            setTimeout(() => {
              clearTrackingParams();
              setShowTracking(false);
            }, 5000);
          }
        } else {
          console.log("No tracking parameters found");
        }
      } catch (error) {
        console.error("Error in tracking check:", error);
      } finally {
        setIsTracking(false);
      }
    };

    checkAndTrack();
  }, []); // Empty dependency array - only run once on mount

  // Don't render anything if not tracking
  if (!showTracking) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 animate-fade-in">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center">
            {isTracking ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-2"></div>
            ) : (
              <div className="w-4 h-4 mr-2">
                {trackingStatus.includes("✅") ? (
                  <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                ) : trackingStatus.includes("❌") ? (
                  <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                ) : null}
              </div>
            )}
            <h3 className="text-sm font-medium text-gray-800">Location Tracking</h3>
          </div>
          <button
            onClick={() => setShowTracking(false)}
            className="text-gray-400 hover:text-gray-600 text-sm"
          >
            ×
          </button>
        </div>

        <p className="text-xs text-gray-600 mb-2">
          {trackingStatus || "Preparing to track location..."}
        </p>

        {error && <div className="text-xs text-red-600 bg-red-50 p-2 rounded mt-2">{error}</div>}

        {isLoading && (
          <div className="text-xs text-blue-600 bg-blue-50 p-2 rounded mt-2">
            Mohon izinkan akses lokasi pada browser Anda...
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackingHandler;
