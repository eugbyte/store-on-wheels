import { CommonModule } from "@angular/common";
import { AfterViewInit, Component, OnInit } from "@angular/core";
import {
  HUB_CONNECTION,
  MAPBOX_TOKEN,
  MapboxService,
  MessageHubService,
  hubConnection,
  mapboxToken,
} from "~/app/libs/services";
import { GeoInfo } from "~/app/libs/models";

@Component({
  selector: "app-map-page",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./map-page.component.html",
  styleUrl: "./map-page.component.css",
  providers: [
    MapboxService,
    MessageHubService,
    { provide: MAPBOX_TOKEN, useValue: mapboxToken },
    { provide: HUB_CONNECTION, useValue: hubConnection },
  ],
})
export class MapPageComponent implements OnInit, AfterViewInit {
  public geoInfo = new GeoInfo();
  public containerId = "foodtruck-mapbox";

  constructor(
    private messageHub: MessageHubService,
    private mapboxService: MapboxService
  ) {
    this.messageHub.start();
    this.messageHub.sendMockPeriodically();
  }

  ngOnInit() {
    this.messageHub.geoInfo$.subscribe((info) => {
      this.geoInfo = info;
    });
  }

  ngAfterViewInit() {
    this.mapboxService.draw(this.containerId, 103.851959, 1.29027, 12);
  }
}
