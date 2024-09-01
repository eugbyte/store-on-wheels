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

  override watchPosition({
    enableHighAccuracy = false,
    timeout = Infinity,
    maximumAge = Infinity,
  } = {}): Promise<GeolocationPositionError | null> {
    const { _position$, _error$ } = this;

    const promise = super.watchPosition({
      onSuccess: (position) => _position$.next(position),
      onError: (error) => _error$.next(error),
      enableHighAccuracy,
      timeout,
      maximumAge,
    });
    return promise;
  }

  stopWatch(): void {
    navigator.geolocation.clearWatch(this.watchId);
  }

  dispose(): void {
    this.stopWatch();
    this._position$.complete();
    this._error$.complete();
  }
}
