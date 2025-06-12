// src/utils/linkGenerator.ts
import type { TrackingLink } from '../types';

// Production URL configuration - UPDATE THIS WITH YOUR ACTUAL VERCEL URL
const PRODUCTION_URL = 'https://location-tracker-app.vercel.app'; // Replace with your actual Vercel URL
const isDev = import.meta.env.DEV;

export const generateTrackingLink = (targetName: string): TrackingLink => {
    const linkId = `track_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    return {
        id: linkId,
        name: targetName,
        created: new Date(),
        accessed: false,
        accessCount: 0
    };
};

export const createTrackingUrl = (link: TrackingLink): string => {
    // Use production URL when deployed, current URL when in development
    const baseUrl = isDev ? 
        `${window.location.origin}${window.location.pathname}` : 
        PRODUCTION_URL;
    
    const params = new URLSearchParams({
        track: link.id,
        name: link.name
    });

    return `${baseUrl}?${params.toString()}`;
};

export const isValidTrackingLink = (trackId: string): boolean => {
    return trackId.startsWith('track_') && trackId.length > 10;
};

export const extractLinkInfo = (trackId: string) => {
    const parts = trackId.split('_');
    if (parts.length >= 2) {
        const timestamp = parseInt(parts[1]);
        return {
            timestamp,
            createdAt: new Date(timestamp)
        };
    }
    return null;
};

// Enhanced link generation with better security
export const generateSecureTrackingLink = (targetName: string): TrackingLink => {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substr(2, 12);
    const linkId = `track_${timestamp}_${randomString}`;

    return {
        id: linkId,
        name: targetName,
        created: new Date(timestamp),
        accessed: false,
        accessCount: 0
    };
};