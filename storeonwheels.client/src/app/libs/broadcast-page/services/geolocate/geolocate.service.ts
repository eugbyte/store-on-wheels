import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { BaseGeolocateService } from "./base-geolocate.service";

@Injectable({
  providedIn: "root",
})
export class GeolocateService extends BaseGeolocateService {
  // Need 2 separate subjects to handle error of subjects (https://stackoverflow.com/a/41828984/6514532)
  private _position$ = new Subject<GeolocationPosition>();
  private _error$ = new Subject<GeolocationPositionError>();

  get position$(): Observable<GeolocationPosition> {
    return this._position$.asObservable();
  }
  get error$(): Observable<GeolocationPositionError> {
    return this._error$.asObservable();
  }

  /**
   * Get the user's geolocation. Requests for permission if permission has not been granted.
   * @param timeout timeout in miliseconds
   * @returns GeolocationPosition
   */
  override async geolocate({
    enableHighAccuracy = false,
    timeout = 5_000,
    maximumAge = 0,
  } = {}): Promise<GeolocationPosition> {
    const position = await super.geolocate({
      enableHighAccuracy,
      timeout,
      maximumAge,
    });
    this._position$.next(position);
    return position;
  }

  override watchPosition({
    enableHighAccuracy = false,
    timeout = 5_000,
    maximumAge = 0,
  } = {}): Promise<GeolocationPositionError | null> {
    console.log("watching...");
    const { _position$, _error$ } = this;

    const promise = super.watchPosition({
      onSuccess: (position) => _position$.next(position),
      onError: (error) => _error$.next(error),
      enableHighAccuracy,
      timeout,
      maximumAge
    });
    return promise;
  }

  dispose(): void {
    this.stopWatch();
    this._position$.complete();
    this._error$.complete();
  }
}
