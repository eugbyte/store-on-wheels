import { Vendor } from "./Vendor";

/**
  1 to 1 mapping of the web api [GeolocationCoordinates](https://developer.mozilla.org/en-US/docs/Web/API/GeolocationCoordinates)
*/
export class GeoCoordinates {
  latitude = 0;
  longitude = 0;
  altitude: number | null = 0;
  accuracy = 0;
  altitudeAccuracy: number | null = 0;
  heading: number | null = 0;
  speed: number | null = 0;
}

export class GeoInfo {
  vendorId = "";
  vendor = new Vendor();
  coords = new GeoCoordinates();
  timestamp = 0;
}
