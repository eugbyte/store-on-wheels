import { Inject, Injectable } from "@angular/core";
import { HubConnection, HubConnectionState } from "@microsoft/signalr";
import { GeoInfo } from "~/app/libs/map-page/models";
import { Subject } from "rxjs";
import { MathService } from "~/app/libs/shared/services";
import { HUB_CONNECTION } from "./message-hub.provider";

@Injectable({
  providedIn: "root",
})
export class MessageHubService {
  private _geoInfo$ = new Subject<GeoInfo>();
  private intervalId = 0;

  constructor(
    private mathService: MathService,
    @Inject(HUB_CONNECTION) private connection: HubConnection
  ) {
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

  sendMockPeriodically() {
    const { connection, mathService } = this;

    this.intervalId = window.setInterval(() => {
      if (
        connection == null ||
        connection.state != HubConnectionState.Connected
      ) {
        return;
      }
      const info = new GeoInfo();
      info.vendorId = connection.connectionId ?? "";
      info.coords.latitude = 1.3 + mathService.getRandomInt(1, 9) / 1000;
      info.coords.longitude = 103.8 + mathService.getRandomInt(1, 9) / 1000;
      info.coords.heading = mathService.getRandomInt(0, 360);
      info.timestamp = Date.now();
      info.vendor.displayName = "Vendor1";
      info.vendor.description = "Random Vendor";

      console.log("sending message");
      connection.send(
        "broadcastMessageWithoutAuth",
        "random_user",
        JSON.stringify(info)
      );
    }, 5000);
  }

  async cleanUp() {
    clearInterval(this.intervalId);
    await this.connection.stop();
  }
}
