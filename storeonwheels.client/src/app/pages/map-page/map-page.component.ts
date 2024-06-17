import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import "mapbox-gl/dist/mapbox-gl.css";
import {
  MapComponent,
  VendorTableComponent,
} from "~/app/libs/map-page/components";
import {
  HUB_CONNECTION,
  MessageHubService,
  hubConnection,
} from "~/app/libs/map-page/services";
import { GeoInfo } from "~/app/libs/shared/models";
import { Subject } from "rxjs";

@Component({
  selector: "app-map-page",
  standalone: true,
  imports: [CommonModule, MapComponent, VendorTableComponent],
  templateUrl: "./map-page.component.html",
  styleUrl: "./map-page.component.css",
  providers: [
    MessageHubService,
    { provide: HUB_CONNECTION, useValue: hubConnection },
  ],
})
export class MapPageComponent implements OnInit {
  public geoInfo$: Subject<GeoInfo>;

  constructor(private messageHub: MessageHubService) {
    this.geoInfo$ = messageHub.geoInfo$;
  }

  ngOnInit() {
    const { messageHub } = this;
    messageHub.start();
    // messageHub.sendMockPeriodically();
  }
}
