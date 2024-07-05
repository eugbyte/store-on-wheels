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
  private intervalId = 0;

  constructor(@Inject(HUB_CONNECTION) private connection: HubConnection) {
    connection.on("MessageReceived", (_user: string, message: string) => {
      console.log("message received");
      const info: GeoInfo = JSON.parse(message);
      this._geoInfo$.next(info);
    });
  }

  get geoInfo$(): Observable<GeoInfo> {
    return this._geoInfo$.asObservable();
  }

  get state(): HubConnectionState {
    return this.connection.state;
  }

  async start() {
    const { connection } = this;
    if (
      connection == null ||
      connection.state != HubConnectionState.Disconnected
    ) {
      return;
    }
    await connection.start();
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
  }
}
