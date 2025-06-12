// src/hooks/useGeolocation.ts
import { useState, useCallback } from 'react';
import type { GeolocationPosition, IPLocationResponse } from '../types';

export const useGeolocation = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const getIPLocation = async (): Promise<GeolocationPosition> => {
        try {
            const response = await fetch('https://ipapi.co/json/');
            
            if (!response.ok) {
                throw new Error('IP location service unavailable');
            }
            
            const data: IPLocationResponse = await response.json();

            // Validate the response
            if (!data.latitude || !data.longitude) {
                throw new Error('Invalid location data received');
            }

            return {
                latitude: data.latitude,
                longitude: data.longitude,
                accuracy: 10000, // IP-based location is less accurate
                timestamp: new Date(),
                source: 'ip'
            };
        } catch (error) {
            console.error('IP location error:', error);
            throw new Error('Failed to get IP location');
        }
    };

    const getCurrentPosition = useCallback((): Promise<GeolocationPosition> => {
        setLoading(true);
        setError(null);

        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                console.warn('Geolocation not supported, using IP location');
                getIPLocation()
                    .then((position) => {
                        setLoading(false);
                        resolve(position);
                    })
                    .catch((error) => {
                        setLoading(false);
                        setError('Geolocation not supported and IP location failed');
                        reject(error);
                    });
                return;
            }

            const timeoutId = setTimeout(() => {
                setError('Location request timed out');
                reject(new Error('Location request timed out'));
            }, 15000);

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    clearTimeout(timeoutId);
                    setLoading(false);
                    
                    resolve({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        accuracy: position.coords.accuracy,
                        timestamp: new Date(),
                        source: 'gps'
                    });
                },
                (error) => {
                    clearTimeout(timeoutId);
                    console.warn('GPS failed, trying IP location:', error.message);
                    
                    // More specific error handling
                    let errorMessage = 'Failed to get GPS location';
                    switch (error.code) {
                        case error.PERMISSION_DENIED:
                            errorMessage = 'Location access denied by user';
                            break;
                        case error.POSITION_UNAVAILABLE:
                            errorMessage = 'Location information unavailable';
                            break;
                        case error.TIMEOUT:
                            errorMessage = 'Location request timed out';
                            break;
                    }
                    
                    // Fallback to IP location
                    getIPLocation()
                        .then((ipLocation) => {
                            setLoading(false);
                            console.info('Using IP location as fallback');
                            resolve(ipLocation);
                        })
                        .catch((ipError) => {
                            setLoading(false);
                            setError(`${errorMessage}. IP location also failed.`);
                            reject(new Error(`GPS and IP location both failed: ${errorMessage}`));
                        });
                },
                {
                    enableHighAccuracy: true,
                    timeout: 12000,
                    maximumAge: 300000 // 5 minutes
                }
            );
        });
    }, []);

    const watchPosition = useCallback((callback: (position: GeolocationPosition) => void) => {
        if (!navigator.geolocation) {
            setError('Geolocation not supported');
            return null;
        }

        const watchId = navigator.geolocation.watchPosition(
            (position) => {
                callback({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    accuracy: position.coords.accuracy,
                    timestamp: new Date(),
                    source: 'gps'
                });
            },
            (error) => {
                console.error('Watch position error:', error);
                setError('Failed to watch position');
            },
            {
                enableHighAccuracy: true,
                timeout: 15000,
                maximumAge: 60000
            }
        );

        return watchId;
    }, []);

    const clearWatch = useCallback((watchId: number) => {
        if (navigator.geolocation) {
            navigator.geolocation.clearWatch(watchId);
        }
    }, []);

    return {
        getCurrentPosition,
        watchPosition,
        clearWatch,
        loading,
        error
    };
};