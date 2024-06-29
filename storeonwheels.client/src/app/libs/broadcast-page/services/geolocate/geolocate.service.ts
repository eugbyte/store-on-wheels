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

  stop(): void {
    navigator.geolocation.clearWatch(this.watchId);
  }

  dispose(): void {
    this.stop();
    this._position$.complete();
  }
}
