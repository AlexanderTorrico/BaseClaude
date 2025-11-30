import { useState, useEffect } from 'react';
import { LocationModel, LocationChangeDto } from '../models/LocationModel';
import { LocationService } from '../services/LocationService';

export const useLocation = () => {
  const [location, setLocation] = useState<LocationModel | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isManualLocation, setIsManualLocation] = useState<boolean>(false);

  useEffect(() => {
    const initializeLocation = async () => {
      setLoading(true);

      const storedLocation = LocationService.getStoredLocation();

      if (storedLocation) {
        setLocation(storedLocation);
        setIsManualLocation(true);
        setLoading(false);
        return;
      }

      const detectedLocation = await LocationService.detectLocation();

      if (detectedLocation) {
        setLocation(detectedLocation);
        LocationService.saveLocation(detectedLocation);
      }

      setLoading(false);
    };

    initializeLocation();
  }, []);

  const changeLocation = (newLocation: LocationChangeDto) => {
    const updatedLocation: LocationModel = {
      ...newLocation,
      ip: location?.ip || '',
      timezone: location?.timezone || '',
      latitude: location?.latitude || 0,
      longitude: location?.longitude || 0,
    };

    setLocation(updatedLocation);
    LocationService.saveLocation(updatedLocation);
    setIsManualLocation(true);
  };

  const resetToDetectedLocation = async () => {
    setLoading(true);
    LocationService.clearLocation();

    const detectedLocation = await LocationService.detectLocation();

    if (detectedLocation) {
      setLocation(detectedLocation);
      LocationService.saveLocation(detectedLocation);
    }

    setIsManualLocation(false);
    setLoading(false);
  };

  return {
    location,
    loading,
    isManualLocation,
    changeLocation,
    resetToDetectedLocation,
  };
};
