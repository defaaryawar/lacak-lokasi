// src/types/index.ts
export interface LocationData {
    id: string;
    name: string;
    latitude: number;
    longitude: number;
    accuracy: number;
    timestamp: Date;
    status: 'online' | 'offline';
    source?: 'gps' | 'ip';
}

export interface TrackingLink {
    id: string;
    name: string;
    created: Date;
    accessed: boolean;
    accessCount?: number;
}

export interface GeolocationPosition {
    latitude: number;
    longitude: number;
    accuracy: number;
    timestamp: Date;
    source?: 'gps' | 'ip';
}

export interface IPLocationResponse {
    latitude: number;
    longitude: number;
    city: string;
    region: string;
    country: string;
}

export interface StatsData {
    totalTracked: number;
    onlineNow: number;
    activeLinks: number;
}