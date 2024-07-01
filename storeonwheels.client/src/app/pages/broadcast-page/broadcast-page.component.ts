import { Component, OnInit, OnDestroy } from "@angular/core";
import { GeolocateService } from "~/app/libs/broadcast-page/services";
import {
  HUB_CONNECTION,
  MessageHubService,
  hubConnection,
} from "~/app/libs/map-page/services";
import { GeoInfo } from "~/app/libs/shared/models";
import { Observable } from "rxjs";
import { VendorService } from "~/app/libs/broadcast-page/services";

@Component({
  selector: "app-broadcast-page",
  standalone: true,
  imports: [],
  providers: [
    MessageHubService,
    { provide: HUB_CONNECTION, useValue: hubConnection },
  ],
  templateUrl: "./broadcast-page.component.html",
  styleUrl: "./broadcast-page.component.css",
})
export class BroadcastPageComponent implements OnInit, OnDestroy {
  private canBroadcast = false;
  private position$: Observable<GeolocationPosition> = new Observable();

  constructor(
    private geoService: GeolocateService,
    private messageHub: MessageHubService,
    private vendorService: VendorService
  ) {
    this.position$ = geoService.position$;
  }

  async ngOnInit() {
    await this.messageHub.start();

    this.position$.subscribe((position: GeolocationPosition) => {
      if (!this.canBroadcast) {
        return;
      }

      const geoInfo = new GeoInfo();
      geoInfo.coords = position.coords;
      geoInfo.timestamp = Date.now();

      const vendorId: string = hubConnection.connectionId ?? "";
      this.messageHub.sendGeoInfo(vendorId, geoInfo);
    });
  }

  toggleBroadcast() {
    this.canBroadcast = !this.canBroadcast;

    if (!this.canBroadcast) {
      this.geoService.stopWatch();
    } else {
      this.geoService.watchPosition(5000);
    }
  }

  ngOnDestroy() {
    this.geoService.dispose();
  }
}
