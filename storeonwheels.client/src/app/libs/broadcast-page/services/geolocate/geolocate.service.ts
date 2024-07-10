import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { BaseGeolocateService } from "./base-geolocate.service";

@Injectable({
  providedIn: "root",
})
export class GeolocateService extends BaseGeolocateService {
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
    options = {
      enableHighAccuracy: false,
      timeout: 5_000,
      maximumAge: 0,
    },
  } = {}): Promise<GeolocationPositionError | null> {
    console.log("watching...");
    const { _position$, _error$ } = this;

    const promise = super.watchPosition({
      onSuccess: (position) => _position$.next(position),
      onError: (error) => _error$.next(error),
      options,
    });
    return promise;
  }

  dispose(): void {
    this.stopWatch();
    this._position$.complete();
  }
}
