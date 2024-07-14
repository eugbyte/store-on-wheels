import { Injectable } from "@angular/core";

export type GeoPermission = PermissionState | "temp_granted" | "temp_denied";

@Injectable({
  providedIn: "root",
})
export class BaseGeolocateService {
  private _watchId = -1;
  get watchId(): number {
    return this._watchId;
  }

  /**
   * Without prompting the user, get the permission state (https://stackoverflow.com/a/37750156).
   * Note that if the user only grants the permission "temporarily", the permission will still be "prompt",
   * as the temporary permission is tied to the watchId.
   * @returns The geolocation permission state.
   */
  async getPermanentPermission(): Promise<PermissionState> {
    if (!("geolocation" in window.navigator)) {
      throw new Error("browser does not supprt geolocation");
    }

    const res: PermissionStatus = await navigator.permissions.query({
      name: "geolocation",
    });
    return res.state;
  }

  /**
   * Get the user's geolocation. Requests for permission if permission has not been granted.
   * @param timeout timeout in miliseconds
   * @throws GeolocationPositionError
   * @returns GeolocationPosition
   */
  async geolocate({
    enableHighAccuracy = false,
    timeout = Infinity,
    maximumAge = Infinity,
  } = {}): Promise<GeolocationPosition> {
    if (!("geolocation" in window.navigator)) {
      throw new Error("browser does not supprt geolocation");
    }
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve(position);
        },
        (err) => reject(err),
        { enableHighAccuracy, timeout, maximumAge }
      );
    });
  }

  /**
   * Watches the user's geolocation. Requests for permission if permission has not been granted.
   * https://stackoverflow.com/a/31770930/6514532
   * @throws null
   * @returns Error, if any.
   */
  watchPosition({
    onSuccess = (_position: GeolocationPosition) => {},
    onError = (_error: GeolocationPositionError) => {},
    enableHighAccuracy = false,
    timeout = Infinity,
    maximumAge = Infinity,
  } = {}): Promise<GeolocationPositionError | null> {
    if (!("geolocation" in window.navigator)) {
      throw new Error("browser does not supprt geolocation");
    }

    console.log({ enableHighAccuracy, timeout, maximumAge });

    const promise = new Promise<GeolocationPositionError | null>((resolve) => {
      const _onSuccess = (position: GeolocationPosition) => {
        onSuccess(position);
        resolve(null);
      };

      const _onError = (err: GeolocationPositionError) => {
        onError(err);
        resolve(err);
      };

      this._watchId = navigator.geolocation.watchPosition(
        _onSuccess,
        _onError,
        { enableHighAccuracy, timeout, maximumAge }
      );
    });
    return promise;
  }
}
