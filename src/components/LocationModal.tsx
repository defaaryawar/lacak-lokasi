import React from "react";

interface LocationModalProps {
  isVisible: boolean;
  targetName?: string;
  isLoading?: boolean;
}

const LocationModal: React.FC<LocationModalProps> = ({
  isVisible,
  targetName = "Unknown",
  isLoading = false,
}) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6 text-center">
          <div className="text-4xl mb-2">📍</div>
          <h2 className="text-xl font-bold">Mendeteksi Lokasi</h2>
          <p className="text-blue-100 text-sm mt-1">Target: {targetName}</p>
        </div>

        {/* Content */}
        <div className="p-6 text-center">
          {isLoading ? (
            <>
              {/* Loading Animation */}
              <div className="relative mb-6">
                <div className="w-16 h-16 mx-auto">
                  <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
                </div>
              </div>

              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                🔍 Sedang Mencari Lokasi...
              </h3>

              <div className="space-y-2 text-sm text-gray-600 mb-4">
                <p>⏳ Mendeteksi koordinat GPS...</p>
                <p>📡 Menganalisis sinyal lokasi...</p>
                <p>🎯 Menghitung akurasi posisi...</p>
              </div>

              <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                <p className="text-xs text-blue-700 mb-2">💡 **Proses Deteksi:**</p>
                <ul className="text-xs text-blue-600 space-y-1 text-left">
                  <li>• Mencoba menggunakan GPS perangkat</li>
                  <li>• Fallback ke IP geolocation jika diperlukan</li>
                  <li>• Memvalidasi akurasi koordinat</li>
                  <li>• Menyimpan data lokasi secara aman</li>
                </ul>
              </div>
            </>
          ) : (
            <>
              {/* Success State */}
              <div className="text-6xl mb-4">✅</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Lokasi Berhasil Terdeteksi!
              </h3>
              <p className="text-gray-600 text-sm">
                Data lokasi {targetName} telah tersimpan di dashboard
              </p>
            </>
          )}
        </div>

        {/* Progress Indicator */}
        {isLoading && (
          <div className="px-6 pb-6">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full animate-pulse"
                style={{ width: "75%" }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">Estimasi waktu: 5-15 detik</p>
          </div>
        )}

        {/* Info Footer */}
        <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            🔒 Proses ini aman dan menggunakan enkripsi end-to-end
          </p>
        </div>
      </div>
    </div>
  );
};

export default LocationModal;
