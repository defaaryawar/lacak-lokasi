// src/components/LocationList.tsx
import React from "react";
import type { LocationData } from "../types";

interface LocationListProps {
  locations: LocationData[];
  onLocationFocus: (locationId: string) => void;
}

const LocationList: React.FC<LocationListProps> = ({ locations, onLocationFocus }) => {
  if (locations.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📍</div>
        <div className="text-gray-500 text-lg mb-2">Belum ada lokasi yang tertrack</div>
        <div className="text-gray-400 text-sm">
          Buat link dan bagikan untuk mulai tracking lokasi
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {locations.map((location) => (
        <div
          key={location.id}
          className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition duration-300 bg-white"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {/* Avatar */}
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-md">
                {location.name.charAt(0).toUpperCase()}
              </div>

              {/* User Info */}
              <div>
                <div className="font-semibold text-gray-800 text-lg">{location.name}</div>
                <div className="text-sm text-gray-500">
                  {location.timestamp.toLocaleString("id-ID")}
                </div>
                <div className="flex items-center mt-1">
                  <span className="text-xs text-gray-400">
                    📍 {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
                  </span>
                </div>
              </div>
            </div>

            {/* Status & Actions */}
            <div className="text-right">
              <div className="flex items-center justify-end mb-2">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2 pulse"></span>
                <span className="text-green-600 text-sm font-medium">Online</span>
              </div>

              <div className="flex flex-col space-y-1">
                <button
                  onClick={() => onLocationFocus(location.id)}
                  className="text-blue-500 hover:text-blue-700 text-sm font-medium transition duration-200"
                >
                  📍 Lihat di Peta
                </button>

                <div className="text-xs text-gray-500 flex items-center">
                  {location.source === "ip" ? (
                    <>
                      <span className="text-orange-500 mr-1">🌐</span>
                      IP Location
                    </>
                  ) : (
                    <>
                      <span className="text-green-500 mr-1">📱</span>
                      GPS
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="flex justify-between items-center text-xs text-gray-500">
              <span>Akurasi: {location.accuracy}m</span>
              <span>ID: {location.id.slice(-8)}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LocationList;
