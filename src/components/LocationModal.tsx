// src/components/LocationModal.tsx
import React from "react";

interface LocationModalProps {
  isVisible: boolean;
  targetName?: string;
}

const LocationModal: React.FC<LocationModalProps> = ({ isVisible, targetName }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl p-8 max-w-md w-full shadow-2xl">
        <div className="text-center">
          {/* Loading Animation */}
          <div className="text-8xl mb-6 animate-bounce">📍</div>

          <h3 className="text-2xl font-bold text-gray-800 mb-3">Mengambil Lokasi...</h3>

          {targetName && (
            <p className="text-gray-600 mb-4">
              Sedang mendapatkan lokasi <span className="font-semibold">{targetName}</span>
            </p>
          )}

          <p className="text-gray-500 mb-6 text-sm">Proses ini akan berlangsung secara otomatis</p>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
            <div
              className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full animate-pulse-slow transition-all duration-1000"
              style={{ width: "75%" }}
            ></div>
          </div>

          <div className="flex items-center justify-center space-x-2 text-gray-400 text-sm">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping"></div>
            <div
              className="w-2 h-2 bg-blue-500 rounded-full animate-ping"
              style={{ animationDelay: "0.2s" }}
            ></div>
            <div
              className="w-2 h-2 bg-blue-500 rounded-full animate-ping"
              style={{ animationDelay: "0.4s" }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationModal;
