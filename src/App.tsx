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

  // Custom Hooks
  const { getCurrentPosition, loading } = useGeolocation();

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

  // Process location tracking
  const processLocationTracking = async (targetName: string) => {
    setShowLocationModal(true);
    setCurrentTarget(targetName);

    try {
      const position = await getCurrentPosition();
      const locationData = createLocationData(targetName, position);

      setLocations((prev) => [...prev, locationData]);

      // Update link access status
      setTrackingLinks((prev) =>
        prev.map((link) =>
          link.name === targetName
            ? { ...link, accessed: true, accessCount: (link.accessCount || 0) + 1 }
            : link
        )
      );
    } catch (error) {
      console.error("Failed to get location:", error);
      alert("Gagal mendapatkan lokasi. Silakan coba lagi.");
    } finally {
      setShowLocationModal(false);
      setCurrentTarget(null);
      clearTrackingParams();
    }
  };

  // Check for tracking parameters on load
  useEffect(() => {
    const { trackId, name } = parseTrackingParams();

    if (trackId && name) {
      // Small delay to show the modal properly
      setTimeout(() => {
        processLocationTracking(name);
      }, 500);
    }
  }, []);

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

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-gray-800 mb-3">📍 Location Tracker</h1>
          <p className="text-gray-600 text-lg">Buat link untuk tracking lokasi secara real-time</p>
          <div className="mt-2 text-sm text-gray-500">Powered by React + TypeScript + Vite</div>
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
                    </div>
                    <div className="text-right">
                      <div
                        className={`text-sm font-medium ${
                          link.accessed ? "text-green-600" : "text-orange-600"
                        }`}
                      >
                        {link.accessed ? `✅ Diakses (${link.accessCount}x)` : "⏳ Belum diakses"}
                      </div>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(createTrackingUrl(link));
                          alert("Link copied to clipboard!");
                        }}
                        className="text-blue-500 hover:text-blue-700 text-sm mt-1"
                      >
                        📋 Copy Link
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Location Modal */}
      <LocationModal isVisible={showLocationModal} targetName={currentTarget || undefined} />
    </div>
  );
}

export default App;
