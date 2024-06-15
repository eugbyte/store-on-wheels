import { Inject, Injectable } from "@angular/core";
import { HubConnection, HubConnectionState } from "@microsoft/signalr";
import { GeoInfo } from "~/app/libs/shared/models";
import { Subject } from "rxjs";
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

  public get geoInfo$() {
    return this._geoInfo$;
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

  async sendVendor(info: GeoInfo) {
    const { connection } = this;

    await connection.send(
      "broadcastVendorPosition",
      "random_user",
      JSON.stringify(info)
    );
  }

  async cleanUp() {
    clearInterval(this.intervalId);
    await this.connection.stop();
  }
}
