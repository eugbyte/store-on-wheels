import { Inject, Injectable } from "@angular/core";
import { HubConnection, HubConnectionState } from "@microsoft/signalr";
import { GeoInfo } from "~/app/libs/shared/models";
import { Observable, Subject } from "rxjs";
import { HUB_CONNECTION } from "./message-hub.provider";

@Injectable({
  providedIn: "root",
})
export class MessageHubService {
  private _geoInfo$ = new Subject<GeoInfo>();
  private _state$ = new Subject<HubConnectionState>();
  private intervalId = 0;

  constructor(@Inject(HUB_CONNECTION) private connection: HubConnection) {
    this.connection.on("MessageReceived", (_user: string, message: string) => {
      const info: GeoInfo = JSON.parse(message);
      this._geoInfo$.next(info);
    });

    this._state$.next(connection.state);
  }

  get geoInfo$(): Observable<GeoInfo> {
    return this._geoInfo$.asObservable();
  }

  get state(): HubConnectionState {
    return this.connection.state;
  }

  get state$(): Observable<HubConnectionState> {
    return this._state$.asObservable();
  }

  async start() {
    const { connection } = this;
    this._state$.next(connection.state);

    if (
      connection == null ||
      connection.state != HubConnectionState.Disconnected
    ) {
      console.log(`connection already ${connection.state}`);
      return;
    }

    await connection.start();
    this._state$.next(connection.state);
  }

  async sendGeoInfo(userId: string, info: GeoInfo) {
    const { connection } = this;

    await connection.send(
      "broadcastVendorPositionAnonymously",
      userId,
      JSON.stringify(info)
    );
  }

  async dispose() {
    clearInterval(this.intervalId);
    await this.connection.stop();
    this._geoInfo$.complete();
    this._state$.complete();
  }
}
