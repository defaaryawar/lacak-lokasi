// src/components/DebugTracker.tsx
import React, { useState, useEffect } from "react";
import { parseTrackingParams, getCurrentLocation } from "../utils/locationUtils";
import { useLocalStorage } from "../hooks/useLocalStorage";
import type { LocationData } from "../types";

const DebugTracker: React.FC = () => {
  const [debugInfo, setDebugInfo] = useState<any>({});
  const [showDebug, setShowDebug] = useState(false);
  const [trackedLocations] = useLocalStorage<LocationData[]>("trackedLocations", []);

  const runDebug = async () => {
    const debug: any = {
      timestamp: new Date().toISOString(),
      url: window.location.href,
      pathname: window.location.pathname,
      search: window.location.search,
      hash: window.location.hash,
    };

    // Check URL parsing
    try {
      const trackingParams = parseTrackingParams();
      debug.trackingParams = trackingParams;
    } catch (error) {
      debug.trackingParamsError = error instanceof Error ? error.message : "Unknown error";
    }

    // Check geolocation support
    debug.geolocationSupported = "geolocation" in navigator;

    // Check permissions API
    if ("permissions" in navigator) {
      try {
        const permission = await navigator.permissions.query({ name: "geolocation" });
        debug.locationPermission = permission.state;
      } catch (error) {
        debug.locationPermissionError = error instanceof Error ? error.message : "Unknown error";
      }
    }

    // Check localStorage
    try {
      debug.localStorageWorking = true;
      debug.trackedLocationsCount = trackedLocations.length;
      debug.trackedLocations = trackedLocations.slice(-3); // Last 3 entries
    } catch (error) {
      debug.localStorageError = error instanceof Error ? error.message : "Unknown error";
    }

    // Test location getting
    try {
      debug.locationTestStarted = true;
      const position = await getCurrentLocation();
      debug.locationTestSuccess = true;
      debug.testPosition = {
        latitude: position.latitude,
        longitude: position.longitude,
        accuracy: position.accuracy,
        source: position.source,
      };
    } catch (error) {
      debug.locationTestError = error instanceof Error ? error.message : "Unknown error";
    }

    setDebugInfo(debug);
  };

  useEffect(() => {
    // Auto-run debug on mount
    runDebug();
  }, []);

  if (!showDebug) {
    return (
      <div className="fixed bottom-4 left-4 z-50">
        <button
          onClick={() => setShowDebug(true)}
          className="bg-gray-800 text-white px-3 py-2 rounded-lg text-xs hover:bg-gray-700 transition"
        >
          🐛 Debug Tracker
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 left-4 z-50 max-w-md max-h-96 overflow-y-auto">
      <div className="bg-gray-900 text-green-400 rounded-lg p-4 text-xs font-mono">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-white font-bold">🐛 Tracking Debug Info</h3>
          <div className="flex gap-2">
            <button
              onClick={runDebug}
              className="bg-blue-600 text-white px-2 py-1 rounded text-xs hover:bg-blue-700"
            >
              Refresh
            </button>
            <button
              onClick={() => setShowDebug(false)}
              className="bg-red-600 text-white px-2 py-1 rounded text-xs hover:bg-red-700"
            >
              Close
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <div>
            <div className="text-yellow-400 font-bold">URL Info:</div>
            <div>Full URL: {debugInfo.url}</div>
            <div>Pathname: {debugInfo.pathname}</div>
            <div>Search: {debugInfo.search || "None"}</div>
          </div>

          <div>
            <div className="text-yellow-400 font-bold">Tracking Params:</div>
            {debugInfo.trackingParams ? (
              <div>
                <div>Track ID: {debugInfo.trackingParams.trackId || "None"}</div>
                <div>Name: {debugInfo.trackingParams.name || "None"}</div>
              </div>
            ) : (
              <div className="text-red-400">Error: {debugInfo.trackingParamsError}</div>
            )}
          </div>

          <div>
            <div className="text-yellow-400 font-bold">Geolocation:</div>
            <div>Supported: {debugInfo.geolocationSupported ? "✅" : "❌"}</div>
            <div>Permission: {debugInfo.locationPermission || "Unknown"}</div>
            {debugInfo.locationTestSuccess ? (
              <div className="text-green-400">
                <div>✅ Location Test Success</div>
                <div>Lat: {debugInfo.testPosition?.latitude}</div>
                <div>Lng: {debugInfo.testPosition?.longitude}</div>
                <div>Accuracy: {debugInfo.testPosition?.accuracy}m</div>
                <div>Source: {debugInfo.testPosition?.source}</div>
              </div>
            ) : debugInfo.locationTestError ? (
              <div className="text-red-400">❌ Error: {debugInfo.locationTestError}</div>
            ) : (
              <div className="text-yellow-400">⏳ Testing...</div>
            )}
          </div>

          <div>
            <div className="text-yellow-400 font-bold">Storage:</div>
            <div>Count: {debugInfo.trackedLocationsCount || 0}</div>
            {debugInfo.trackedLocations && debugInfo.trackedLocations.length > 0 && (
              <div>
                <div className="text-gray-400">Recent entries:</div>
                {debugInfo.trackedLocations.map((loc: LocationData, index: number) => (
                  <div key={index} className="ml-2 text-xs">
                    • {loc.name} - {new Date(loc.timestamp).toLocaleTimeString()}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="text-gray-400 text-xs border-t border-gray-700 pt-2">
            Last updated: {debugInfo.timestamp}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DebugTracker;
