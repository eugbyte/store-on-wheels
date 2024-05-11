import { Component, Inject, Injectable } from '@angular/core';
import { HubConnection, HubConnectionState } from '@microsoft/signalr';
import { GeoInfo } from '~/app/libs/models';
import { Subject } from 'rxjs';
import { MathService } from '../math/math.service';
import { HUB_CONNECTION_TOKEN } from './create-connection';

@Injectable({
  // service needs to be transient since we are injecting the connection
  providedIn: null,
})
export class MessageHubService {
  private geoInfo$ = new Subject<GeoInfo>();
  private intervalId = 0;

  constructor(
    private mathService: MathService,
    @Inject(HUB_CONNECTION_TOKEN) private connection: HubConnection,
  ) {
    connection.on("MessageReceived", (_user: string, message: string) => {
      console.log("message received");
      const info: GeoInfo = JSON.parse(message);
      this.geoInfo$.next(info);
    });
  }

  async start() {
    const { connection } = this;
    if (connection == null || connection.state != HubConnectionState.Disconnected) {
      return;
    }
    await connection.start();
  }

  periodicSendMock() {
    const { connection, mathService } = this;

    this.intervalId = window.setInterval(() => {
      if (connection == null || connection.state != HubConnectionState.Connected) {
        return;
      }
      const info = new GeoInfo();
      info.vendorId = connection.connectionId ?? "";
      info.coords.latitude = mathService.getRandomNum(1, 11);
      info.coords.longitude = mathService.getRandomNum(1, 11);

      console.log("sending message");
      connection.send("broadcastMessageWithoutAuth", "random_user", JSON.stringify(info));
    }, 5000);
  }

  async cleanUp() {
    clearInterval(this.intervalId);
    await this.connection.stop();
  }

  
}
