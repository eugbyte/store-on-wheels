import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";

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
   * Get the user's geolocation. Requests for permission if permission has not been granted.
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

  watchPosition(timeout: number): Observable<GeolocationPosition> {
    const options: PositionOptions = {
      enableHighAccuracy: true,
      timeout,
    };

    const position$ = new Subject<GeolocationPosition>();
    const id = navigator.geolocation.watchPosition(
      (position) => {
        position$.next(position);
      },
      (err) => position$.error(err),
      options
    );

    navigator.geolocation.clearWatch(id);

    return position$.asObservable();
  }
}
