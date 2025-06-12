// src/hooks/useGeolocation.ts
import { useState, useCallback } from 'react';
import type { GeolocationPosition } from '../types';
import { getCurrentLocation } from '../utils/locationUtils';

interface UseGeolocationReturn {
  getCurrentPosition: () => Promise<GeolocationPosition>;
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
  requestPermission: () => Promise<boolean>;
}

export const useGeolocation = (): UseGeolocationReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const requestPermission = useCallback(async (): Promise<boolean> => {
    try {
      // Check if permissions API is available
      if ('permissions' in navigator) {
        const permission = await navigator.permissions.query({ name: 'geolocation' });
        
        if (permission.state === 'granted') {
          return true;
        } else if (permission.state === 'prompt') {
          // Will be prompted when getCurrentPosition is called
          return true;
        } else {
          setError('Akses lokasi ditolak secara permanen. Silakan aktifkan di pengaturan browser.');
          return false;
        }
      }
      
      // Fallback for browsers without permissions API
      return true;
    } catch (err) {
      console.error('Permission check failed:', err);
      return true; // Assume permission available
    }
  }, []);

  const getCurrentPosition = useCallback(async (): Promise<GeolocationPosition> => {
    setIsLoading(true);
    setError(null);

    try {
      // First check permission
      const hasPermission = await requestPermission();
      if (!hasPermission) {
        throw new Error('Akses lokasi tidak diizinkan');
      }

      // Get current location with enhanced fallback
      const position = await getCurrentLocation();
      
      setIsLoading(false);
      return position;
    } catch (err) {
      setIsLoading(false);
      const errorMessage = err instanceof Error ? err.message : 'Gagal mendapatkan lokasi';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [requestPermission]);

  return {
    getCurrentPosition,
    isLoading,
    error,
    clearError,
    requestPermission
  };
};