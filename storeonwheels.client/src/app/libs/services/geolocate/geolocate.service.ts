import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class GeolocateService {
  /**
   * Without prompting the user, get the permission state (https://stackoverflow.com/a/37750156).
   * @returns The geolocation permission state.
   */
  async getPermissionState(): Promise<PermissionState> {
    if (!("geolocation" in window.navigator)) {
      throw new Error("browser does not supprt geolocation");
    }

    const res = await navigator.permissions.query({ name: "geolocation" });
    return res.state;
  }

  /**
   * Get the user's geolocation
   * @param timeout timeout in miliseconds
   * @returns
   */
  async geolocate(timeout: number): Promise<GeolocationPosition> {
    const options: PositionOptions = {
      enableHighAccuracy: true,
      timeout,
    };
    return new Promise((resolve, reject) =>
      navigator.geolocation.getCurrentPosition(resolve, reject, options)
    );
  }
}
