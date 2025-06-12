// src/components/StatsCards.tsx
import React from "react";
import type { StatsData } from "../types";

interface StatsCardsProps {
  stats: StatsData;
}

const StatsCards: React.FC<StatsCardsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {/* Total Tracked */}
      <div className="bg-gradient-to-r from-green-400 to-green-500 text-white p-4 rounded-lg shadow-md hover:shadow-lg transition duration-300 transform hover:-translate-y-1">
        <div className="flex items-center">
          <div className="text-3xl mr-3">👥</div>
          <div>
            <div className="text-sm opacity-90 font-medium">Total Tracked</div>
            <div className="text-2xl font-bold">{stats.totalTracked}</div>
          </div>
        </div>
      </div>

      {/* Online Now */}
      <div className="bg-gradient-to-r from-blue-400 to-blue-500 text-white p-4 rounded-lg shadow-md hover:shadow-lg transition duration-300 transform hover:-translate-y-1">
        <div className="flex items-center">
          <div className="text-3xl mr-3">🟢</div>
          <div>
            <div className="text-sm opacity-90 font-medium">Online Sekarang</div>
            <div className="text-2xl font-bold">{stats.onlineNow}</div>
          </div>
        </div>
      </div>

      {/* Active Links */}
      <div className="bg-gradient-to-r from-purple-400 to-purple-500 text-white p-4 rounded-lg shadow-md hover:shadow-lg transition duration-300 transform hover:-translate-y-1">
        <div className="flex items-center">
          <div className="text-3xl mr-3">🔗</div>
          <div>
            <div className="text-sm opacity-90 font-medium">Link Aktif</div>
            <div className="text-2xl font-bold">{stats.activeLinks}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsCards;
