// src/utils/locationUtils.ts
import type { LocationData, GeolocationPosition } from '../types';
import { decodeTrackingParams, cleanupDisguisedUrl } from './linkGenerator';

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
    console.log('=== DEBUG: parseTrackingParams ===');
    console.log('Current URL:', window.location.href);
    console.log('Pathname:', window.location.pathname);
    console.log('Search:', window.location.search);

    // Check if this is a disguised URL (has path segments)
    const pathSegments = window.location.pathname.split('/').filter(segment => segment.length > 0);
    console.log('Path segments:', pathSegments);

    if (pathSegments.length >= 2 && window.location.search) {
        console.log('✅ Detected disguised URL format');
        // This looks like a disguised URL, try to decode
        const disguisedParams = decodeTrackingParams();
        console.log('Disguised params result:', disguisedParams);
        return disguisedParams;
    }

    // Fallback to old format for backward compatibility
    console.log('🔄 Trying legacy format...');
    const urlParams = new URLSearchParams(window.location.search);
    const trackId = urlParams.get('track');
    const name = urlParams.get('name');

    const legacyResult = {
        trackId,
        name: name ? decodeURIComponent(name) : null
    };
    console.log('Legacy params result:', legacyResult);

    return legacyResult;
};

export const clearTrackingParams = () => {
    console.log('=== DEBUG: clearTrackingParams ===');

    // Check if this is a disguised URL (has path segments)
    const pathSegments = window.location.pathname.split('/').filter(segment => segment.length > 0);
    console.log('Path segments for cleanup:', pathSegments);

    if (pathSegments.length >= 2) {
        // This is a disguised URL, clean it up completely
        console.log('🧹 Cleaning up disguised URL...');
        cleanupDisguisedUrl();
    } else {
        // Regular URL with query parameters
        console.log('🧹 Cleaning up regular URL parameters...');
        const url = new URL(window.location.href);
        url.searchParams.delete('track');
        url.searchParams.delete('name');
        url.searchParams.delete('id');
        url.searchParams.delete('ref');
        url.searchParams.delete('utm');
        url.searchParams.delete('v');
        window.history.replaceState({}, document.title, url.toString());
    }
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

// IP-based location fallback
export const getLocationFromIP = async (): Promise<GeolocationPosition | null> => {
    try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();

        if (data.latitude && data.longitude) {
            return {
                latitude: parseFloat(data.latitude),
                longitude: parseFloat(data.longitude),
                accuracy: 10000, // IP location is less accurate
                timestamp: new Date(),
                source: 'ip'
            };
        }
    } catch (error) {
        console.error('Failed to get IP location:', error);
    }

    return null;
};

// Enhanced geolocation with better error handling and fallbacks
export const getCurrentLocation = (): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
        // Check if geolocation is supported
        if (!navigator.geolocation) {
            console.log('Geolocation not supported, trying IP location...');
            getLocationFromIP().then(ipLocation => {
                if (ipLocation) {
                    resolve(ipLocation);
                } else {
                    reject(new Error('Geolocation tidak didukung dan IP location gagal'));
                }
            });
            return;
        }

        // Options for geolocation
        const options: PositionOptions = {
            enableHighAccuracy: true,
            timeout: 15000, // Increased timeout
            maximumAge: 300000 // 5 minutes cache
        };

        let timeoutId: number;
        let resolved = false;

        // Set up timeout fallback to IP location
        timeoutId = setTimeout(async () => {
            if (!resolved) {
                console.log('GPS timeout, trying IP location...');
                const ipLocation = await getLocationFromIP();
                if (ipLocation && !resolved) {
                    resolved = true;
                    resolve(ipLocation);
                }
            }
        }, 10000); // 10 second timeout before trying IP

        navigator.geolocation.getCurrentPosition(
            (position) => {
                if (!resolved) {
                    resolved = true;
                    clearTimeout(timeoutId);
                    resolve({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        accuracy: position.coords.accuracy,
                        timestamp: new Date(position.timestamp),
                        source: 'gps'
                    });
                }
            },
            async (error) => {
                if (!resolved) {
                    console.error('Geolocation error:', error);

                    // Try IP location as fallback
                    const ipLocation = await getLocationFromIP();
                    if (ipLocation) {
                        resolved = true;
                        clearTimeout(timeoutId);
                        resolve(ipLocation);
                    } else if (!resolved) {
                        resolved = true;
                        clearTimeout(timeoutId);

                        let errorMessage = 'Gagal mendapatkan lokasi';
                        switch (error.code) {
                            case error.PERMISSION_DENIED:
                                errorMessage = 'Akses lokasi ditolak. Silakan izinkan akses lokasi di browser.';
                                break;
                            case error.POSITION_UNAVAILABLE:
                                errorMessage = 'Lokasi tidak tersedia. Pastikan GPS aktif.';
                                break;
                            case error.TIMEOUT:
                                errorMessage = 'Timeout mendapatkan lokasi. Silakan coba lagi.';
                                break;
                        }
                        reject(new Error(errorMessage));
                    }
                }
            },
            options
        );
    });
};