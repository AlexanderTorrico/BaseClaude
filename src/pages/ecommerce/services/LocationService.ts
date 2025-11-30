import { LocationModel } from '../models/LocationModel';

export class LocationService {
  private static readonly API_URL = 'https://ipapi.co/json/';

  static async detectLocation(): Promise<LocationModel | null> {
    try {
      const response = await fetch(this.API_URL);

      if (!response.ok) {
        throw new Error('Error al obtener la ubicación');
      }

      const data = await response.json();

      return {
        country: data.country_name || 'Desconocido',
        countryCode: data.country_code || '',
        region: data.region || 'Desconocido',
        regionCode: data.region_code || '',
        city: data.city || 'Desconocido',
        ip: data.ip || '',
        timezone: data.timezone || '',
        latitude: data.latitude || 0,
        longitude: data.longitude || 0,
      };
    } catch (error) {
      console.error('Error detectando ubicación:', error);
      return null;
    }
  }

  static getStoredLocation(): LocationModel | null {
    const stored = localStorage.getItem('userLocation');
    return stored ? JSON.parse(stored) : null;
  }

  static saveLocation(location: LocationModel): void {
    localStorage.setItem('userLocation', JSON.stringify(location));
  }

  static clearLocation(): void {
    localStorage.removeItem('userLocation');
  }
}
