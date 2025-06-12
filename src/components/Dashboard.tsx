// src/components/Dashboard.tsx

import React, { useState, useRef } from "react";
import type { LocationData, StatsData } from "../types";
import StatsCards from "./StatsCards";
import LocationList from "./LocationList";
import MapComponent from "./MapComponent";

interface DashboardProps {
  locations: LocationData[];
  stats: StatsData;
}

interface MapComponentRef {
  focusOnLocation: (locationId: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ locations, stats }) => {
  const [focusedLocationId, setFocusedLocationId] = useState<string | null>(null);
  const mapRef = useRef<MapComponentRef>(null);

  const handleLocationFocus = (locationId: string) => {
    // Set focused location for prop-based focusing
    setFocusedLocationId(locationId);
    
    // Also use ref method for immediate focusing
    if (mapRef.current) {
      mapRef.current.focusOnLocation(locationId);
    }
    
    // Clear focused state after a short delay to allow re-focusing same location
    setTimeout(() => {
      setFocusedLocationId(null);
    }, 100);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">📊 Dashboard Tracking</h2>

      {/* Stats Cards */}
      <StatsCards stats={stats} />

      {/* Map */}
      <MapComponent 
        ref={mapRef}
        locations={locations} 
        onLocationFocus={handleLocationFocus}
        focusedLocationId={focusedLocationId}
      />

      {/* Location List */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">📋 Daftar Lokasi Terlacak</h3>
        <LocationList locations={locations} onLocationFocus={handleLocationFocus} />
      </div>
    </div>
  );
};

export default Dashboard;