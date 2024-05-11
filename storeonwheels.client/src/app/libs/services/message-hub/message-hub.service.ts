import { Inject, Injectable } from '@angular/core';
import { HubConnection, HubConnectionState } from '@microsoft/signalr';
import { GeoInfo } from '~/app/libs/models';
import { Subject } from 'rxjs';
import { RandomService } from '../random/random.service';
import { HUB_CONNECTION_TOKEN } from './create-connection';

@Injectable({
  providedIn: 'root',
})
export class MessageHubService {
  private geoInfo$ = new Subject<GeoInfo>();
  private intervalId = 0;

  constructor(@Inject(HUB_CONNECTION_TOKEN) private connection: HubConnection, private randomService: RandomService) {
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
    const { connection, randomService } = this;

    this.intervalId = window.setInterval(() => {
      if (connection == null || connection.state != HubConnectionState.Connected) {
        return;
      }
      const info = new GeoInfo();
      info.vendorId = connection.connectionId ?? "";
      info.coords.latitude = randomService.getRandomNum(1, 11);
      info.coords.longitude = randomService.getRandomNum(1, 11);

      console.log("sending message");
      connection.send("broadcastMessageWithoutAuth", "random_user", JSON.stringify(info));
    }, 5000);
  }

  async cleanUp() {
    clearInterval(this.intervalId);
    await this.connection.stop();
  }

  
}
