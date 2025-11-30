export interface LocationModel {
  country: string;
  countryCode: string;
  region: string;
  regionCode: string;
  city: string;
  ip: string;
  timezone: string;
  latitude: number;
  longitude: number;
}

export interface LocationChangeDto {
  country: string;
  countryCode: string;
  region: string;
  regionCode: string;
  city: string;
}
