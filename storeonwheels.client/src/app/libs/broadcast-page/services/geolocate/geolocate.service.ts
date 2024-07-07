import { Injectable } from "@angular/core";
import { Observable, Subject, firstValueFrom } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class GeolocateService {
  private _position$ = new Subject<GeolocationPosition>();
  private watchId = 0;
  private options: PositionOptions = {
    enableHighAccuracy: true,
    timeout: 5_000,
    maximumAge: 0,
  };

  get position$(): Observable<GeolocationPosition> {
    return this._position$.asObservable();
  }

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

  async requestPermission(timeout: number = 5000): Promise<PermissionState> {
    let permission: PermissionState = "prompt";
    try {
      const position = await this.geolocate(timeout);
      this._position$.next(position);

      permission = "granted";
    } catch (error) {
      if (error instanceof GeolocationPositionError) {
        // Firefox does not treat temporary denial as "denied" but "prompt"
        if (error.code == GeolocationPositionError.PERMISSION_DENIED) {
          permission = "denied";
        }
      }
    }
    return permission;
  }

  /**
   * Get the user's geolocation. Requests for permission if permission has not been granted.
   * @param timeout timeout in miliseconds
   * @returns GeolocationPosition
   */
  geolocate(timeout: number): Promise<GeolocationPosition> {
    if (!("geolocation" in window.navigator)) {
      throw new Error("browser does not supprt geolocation");
    }
    const { _position$, options } = this;

    navigator.geolocation.getCurrentPosition(
      (position) => _position$.next(position),
      (err) => _position$.error(err),
      { ...options, timeout }
    );

    return firstValueFrom(_position$);
  }

  watchPosition(timeout: number): void {
    if (!("geolocation" in window.navigator)) {
      throw new Error("browser does not supprt geolocation");
    }
    const { _position$ } = this;
    const options: PositionOptions = {
      enableHighAccuracy: true,
      timeout,
    };

    const onSuccess = (position: GeolocationPosition) =>
      _position$.next(position);
    const onError = (err: GeolocationPositionError) => _position$.error(err);

    this.watchId = navigator.geolocation.watchPosition(onSuccess, onError, {
      ...options,
      timeout,
    });
  }

  stopWatch(): void {
    navigator.geolocation.clearWatch(this.watchId);
  }

  dispose(): void {
    this.stopWatch();
    this._position$.complete();
  }
}
