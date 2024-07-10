import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { BaseGeolocateService } from "./base-geolocate.service";

@Injectable({
  providedIn: "root",
})
export class GeolocateService extends BaseGeolocateService {
  private _position$ = new Subject<GeolocationPosition>();

  get position$(): Observable<GeolocationPosition> {
    return this._position$.asObservable();
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
    const { _position$ } = this;

    const promise = super.watchPosition({
      onSuccess: (position) => _position$.next(position),
      onError: (error) => _position$.error(error),
      options,
    });
    return promise;
  }

  dispose(): void {
    this.stopWatch();
    this._position$.complete();
  }
}
