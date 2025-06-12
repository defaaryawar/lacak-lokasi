// src/utils/locationUtils.ts
import type { LocationData, GeolocationPosition } from '../types';

export const createLocationData = (
    name: string,
    position: GeolocationPosition
): LocationData => {
    return {
        id: `loc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name,
        latitude: position.latitude,
        longitude: position.longitude,
        accuracy: position.accuracy,
        timestamp: position.timestamp,
        status: 'online',
        source: position.source
    };
};

export const parseTrackingParams = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const trackId = urlParams.get('track');
    const name = urlParams.get('name');

    return {
        trackId,
        name: name ? decodeURIComponent(name) : null
    };
};

export const clearTrackingParams = () => {
    const url = new URL(window.location.href);
    url.searchParams.delete('track');
    url.searchParams.delete('name');
    window.history.replaceState({}, document.title, url.toString());
};

export const formatCoordinate = (coord: number): string => {
    return coord.toFixed(6);
};

export const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
): number => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};

const toRad = (value: number): number => {
    return value * Math.PI / 180;
};

// Enhanced location utilities
export const validateCoordinates = (lat: number, lon: number): boolean => {
    return lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180;
};

export const getLocationAccuracyText = (accuracy: number): string => {
    if (accuracy < 10) return 'Sangat Akurat';
    if (accuracy < 50) return 'Akurat';
    if (accuracy < 100) return 'Cukup Akurat';
    if (accuracy < 1000) return 'Kurang Akurat';
    return 'Tidak Akurat';
};

export const formatLocationString = (lat: number, lon: number): string => {
    const latDir = lat >= 0 ? 'N' : 'S';
    const lonDir = lon >= 0 ? 'E' : 'W';
    return `${Math.abs(lat).toFixed(6)}°${latDir}, ${Math.abs(lon).toFixed(6)}°${lonDir}`;
};