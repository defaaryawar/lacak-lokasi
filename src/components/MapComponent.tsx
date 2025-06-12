// src/components/MapComponent.tsx

import React, { useState, useImperativeHandle, forwardRef } from "react";
import type { LocationData } from "../types";

interface MapComponentProps {
  locations: LocationData[];
  onLocationFocus?: (locationId: string) => void;
  focusedLocationId?: string | null;
}

interface MapComponentRef {
  focusOnLocation: (locationId: string) => void;
}

const MapComponent = forwardRef<MapComponentRef, MapComponentProps>(
  ({ locations, onLocationFocus, focusedLocationId }, ref) => {
    const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(null);
    // Expose focusOnLocation method via ref
    useImperativeHandle(ref, () => ({
      focusOnLocation: (locationId: string) => {
        const location = locations.find((loc) => loc.id === locationId);
        if (location) {
          setSelectedLocation(location);
        }
      },
    }));

    // Handle focused location from prop
    React.useEffect(() => {
      if (focusedLocationId) {
        const location = locations.find((loc) => loc.id === focusedLocationId);
        if (location) {
          setSelectedLocation(location);
        }
      }
    }, [focusedLocationId, locations]);

    const handleLocationClick = (location: LocationData) => {
      setSelectedLocation(location);
      if (onLocationFocus) {
        onLocationFocus(location.id);
      }
    };

    const openInGoogleMaps = (location: LocationData) => {
      const url = `https://www.google.com/maps?q=${location.latitude},${location.longitude}&z=16`;
      window.open(url, "_blank");
    };

    const openAllInGoogleMaps = () => {
      if (locations.length === 0) return;

      if (locations.length === 1) {
        openInGoogleMaps(locations[0]);
        return;
      }

      // Create directions URL with multiple waypoints
      const origin = locations[0];
      const destination = locations[locations.length - 1];
      const waypoints = locations
        .slice(1, -1)
        .map((loc) => `${loc.latitude},${loc.longitude}`)
        .join("|");

      let url = `https://www.google.com/maps/dir/${origin.latitude},${origin.longitude}`;
      if (waypoints) {
        url += `/${waypoints}`;
      }
      url += `/${destination.latitude},${destination.longitude}`;

      window.open(url, "_blank");
    };

    return (
      <div className="relative mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">🗺️ Peta Lokasi Real-time</h3>
          <div className="flex gap-2">
            <button
              onClick={openAllInGoogleMaps}
              className="px-3 py-1 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 transition-colors"
              disabled={locations.length === 0}
            >
              📍 Buka di Google Maps
            </button>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg border border-gray-300 shadow-sm overflow-hidden">
          {/* Interactive Map Preview */}
          <div className="relative h-96 bg-gradient-to-br from-blue-50 to-green-50 overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="grid grid-cols-8 h-full">
                {Array.from({ length: 64 }).map((_, i) => (
                  <div key={i} className="border border-gray-300"></div>
                ))}
              </div>
            </div>

            {/* Location Points */}
            <div className="absolute inset-0 p-4">
              {locations.map((location, index) => {
                // Simple positioning based on coordinates (rough approximation)
                const x = ((location.longitude + 180) / 360) * 100;
                const y = ((90 - location.latitude) / 180) * 100;

                const isSelected = selectedLocation?.id === location.id;

                return (
                  <div
                    key={location.id}
                    className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-200 ${
                      isSelected ? "scale-125 z-20" : "hover:scale-110 z-10"
                    }`}
                    style={{
                      left: `${Math.max(5, Math.min(95, x))}%`,
                      top: `${Math.max(5, Math.min(95, y))}%`,
                    }}
                    onClick={() => handleLocationClick(location)}
                  >
                    {/* Marker */}
                    <div className={`relative ${isSelected ? "animate-bounce" : ""}`}>
                      <div
                        className={`w-6 h-6 rounded-full border-2 border-white shadow-lg ${
                          location.source === "gps" ? "bg-green-500" : "bg-orange-500"
                        } ${isSelected ? "ring-4 ring-blue-300" : ""}`}
                      >
                        <div className="absolute inset-0 flex items-center justify-center text-white text-xs font-bold">
                          {index + 1}
                        </div>
                      </div>
                      {/* Pulse effect for selected */}
                      {isSelected && (
                        <div className="absolute inset-0 w-6 h-6 rounded-full bg-blue-400 animate-ping"></div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* No locations message */}
            {locations.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <div className="text-4xl mb-2">📍</div>
                  <p className="text-sm">Belum ada lokasi yang terlacak</p>
                </div>
              </div>
            )}

            {/* Selected Location Popup */}
            {selectedLocation && (
              <div className="absolute bottom-4 left-4 right-4 bg-white rounded-lg shadow-lg p-4 border-l-4 border-blue-500">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800 mb-1">{selectedLocation.name}</h4>
                    <p className="text-sm text-gray-600 mb-1">
                      {selectedLocation.timestamp.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500 mb-2">
                      Akurasi: {selectedLocation.accuracy}m
                    </p>
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          selectedLocation.source === "gps"
                            ? "bg-green-100 text-green-800"
                            : "bg-orange-100 text-orange-800"
                        }`}
                      >
                        {selectedLocation.source === "gps" ? "📱 GPS" : "📍 IP Location"}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => openInGoogleMaps(selectedLocation)}
                      className="px-2 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600 transition-colors"
                    >
                      Buka
                    </button>
                    <button
                      onClick={() => setSelectedLocation(null)}
                      className="px-2 py-1 bg-gray-500 text-white text-xs rounded hover:bg-gray-600 transition-colors"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Location Stats */}
          {locations.length > 0 && (
            <div className="bg-white p-4 border-t border-gray-200">
              <div className="flex justify-between items-center text-sm text-gray-600">
                <span>Total Lokasi: {locations.length}</span>
                <span>
                  GPS: {locations.filter((l) => l.source === "gps").length} | IP:{" "}
                  {locations.filter((l) => l.source === "ip").length}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        {locations.length > 0 && (
          <div className="mt-4 flex gap-2 flex-wrap">
            <button
              onClick={() => setSelectedLocation(locations[locations.length - 1])}
              className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-md hover:bg-green-200 transition-colors"
            >
              📍 Lokasi Terbaru
            </button>
            <button
              onClick={() => setSelectedLocation(locations[0])}
              className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-md hover:bg-blue-200 transition-colors"
            >
              🚩 Lokasi Pertama
            </button>
          </div>
        )}
      </div>
    );
  }
);

MapComponent.displayName = "MapComponent";

export default MapComponent;
