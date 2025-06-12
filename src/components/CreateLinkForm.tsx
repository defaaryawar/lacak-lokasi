// src/components/CreateLinkForm.tsx
import React, { useState } from "react";
import type { TrackingLink } from "../types";
import { generateSecureTrackingLink, createTrackingUrl } from "../utils/linkGenerator";

interface CreateLinkFormProps {
  onLinkCreated: (link: TrackingLink) => void;
}

const CreateLinkForm: React.FC<CreateLinkFormProps> = ({ onLinkCreated }) => {
  const [targetName, setTargetName] = useState("");
  const [generatedLink, setGeneratedLink] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [copying, setCopying] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const createTrackingLink = async () => {
    if (!targetName.trim()) {
      alert("Masukkan nama target terlebih dahulu!");
      return;
    }

    setIsCreating(true);

    try {
      // Generate secure tracking link
      const newLink = generateSecureTrackingLink(targetName.trim());

      // Create the full tracking URL
      const trackingUrl = createTrackingUrl(newLink);

      // Add to parent state
      onLinkCreated(newLink);

      // Update local state
      setGeneratedLink(trackingUrl);
      setShowResult(true);
      setTargetName("");
    } catch (error) {
      console.error("Error creating tracking link:", error);
      alert("Gagal membuat link tracking. Silakan coba lagi.");
    } finally {
      setIsCreating(false);
    }
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(generatedLink);
      setCopying(true);
      setTimeout(() => setCopying(false), 2000);
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = generatedLink;
      textArea.style.position = "fixed";
      textArea.style.opacity = "0";
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand("copy");
        setCopying(true);
        setTimeout(() => setCopying(false), 2000);
      } catch (copyErr) {
        alert("Gagal copy link. Silakan copy manual.");
      } finally {
        document.body.removeChild(textArea);
      }
    }
  };

  const shareLink = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Location Tracker - ${targetName}`,
          text: `Track lokasi real-time`,
          url: generatedLink,
        });
      } catch (err) {
        // User cancelled sharing or sharing failed
        console.log("Sharing cancelled or failed:", err);
      }
    } else {
      // Fallback to copying
      copyLink();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createTrackingLink();
  };

  const resetForm = () => {
    setShowResult(false);
    setGeneratedLink("");
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">🔗 Buat Link Tracking</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Nama Target:</label>
          <input
            type="text"
            value={targetName}
            onChange={(e) => setTargetName(e.target.value)}
            placeholder="Masukkan nama orang yang akan ditrack..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
            required
            maxLength={50}
            disabled={isCreating}
          />
          <div className="text-xs text-gray-500 mt-1">{targetName.length}/50 karakter</div>
        </div>

        <button
          type="submit"
          disabled={isCreating || !targetName.trim()}
          className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-600 hover:to-indigo-700 transition duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {isCreating ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Membuat Link...
            </span>
          ) : (
            "🚀 Buat Link Tracking"
          )}
        </button>
      </form>

      {/* Generated Link Display */}
      {showResult && (
        <div className="mt-6 animate-fade-in">
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 border border-green-200">
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-gray-700">
                ✅ Link Tracking Berhasil Dibuat:
              </label>
              <button onClick={resetForm} className="text-gray-500 hover:text-gray-700 text-sm">
                ✕ Close
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={generatedLink}
                  readOnly
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm font-mono"
                />
                <button
                  onClick={copyLink}
                  className={`px-4 py-2 rounded-lg transition duration-300 font-medium ${
                    copying ? "bg-green-500 text-white" : "bg-gray-500 text-white hover:bg-gray-600"
                  }`}
                >
                  {copying ? "✅ Copied!" : "📋 Copy"}
                </button>
              </div>

              {/* Share button for mobile devices */}
              {navigator.share && (
                <button
                  onClick={shareLink}
                  className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300"
                >
                  📤 Share Link
                </button>
              )}

              <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                <p className="text-xs text-blue-700 mb-2">
                  💡 <strong>Cara Penggunaan:</strong>
                </p>
                <ul className="text-xs text-blue-600 space-y-1">
                  <li>• Bagikan link ini ke target yang ingin ditrack</li>
                  <li>• Ketika mereka membuka link, lokasi akan terdeteksi otomatis</li>
                  <li>• Anda akan melihat lokasi mereka di dashboard</li>
                  <li>• Link ini aman dan hanya berfungsi sekali</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateLinkForm;
