import { AfterViewInit, Component, OnInit } from "@angular/core";
import { GeolocateService } from "~/app/libs/broadcast-page/services";
import {
  HUB_CONNECTION,
  MessageHubService,
  hubConnection,
} from "~/app/libs/map-page/services";
import { GeoInfo } from "~/app/libs/shared/models";
import { Observable } from "rxjs";

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
export class BroadcastPageComponent implements AfterViewInit, OnInit {
  private position$: Observable<GeolocationPosition> = new Observable();

  constructor(
    private geoService: GeolocateService,
    private messageHub: MessageHubService
  ) {
    this.position$ = geoService.position$;
  }

  async ngOnInit() {
    const position = await this.geoService.geolocate(5000);
    console.log({ position });
  }

  ngAfterViewInit() {
    this.position$.subscribe((position: GeolocationPosition) => {
      const geoInfo = new GeoInfo();
      geoInfo.coords = position.coords;

      this.messageHub.sendGeoInfo(geoInfo);
    });
  }
}
