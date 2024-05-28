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
import { LngLat, Marker, Popup } from "mapbox-gl";
import { Lru } from "toad-cache";
import "mapbox-gl/dist/mapbox-gl.css";

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
  private markers = new Lru<Marker>();
  private geoInfos = new Lru<GeoInfo>();

  constructor(
    private messageHub: MessageHubService,
    private mapboxService: MapboxService
  ) {
    this.messageHub.start();
    this.messageHub.sendMockPeriodically();
  }

  ngOnInit() {
    const { markers, messageHub, geoInfos, mapboxService } = this;

    messageHub.geoInfo$.subscribe((info: GeoInfo) => {
      if (mapboxService.map == null) {
        return;
      }

      this.geoInfo = info;

      const { map } = mapboxService;
      const { vendorId, vendor, coords, timestamp } = info;
      const { latitude: lat, longitude: lng } = coords;

      const oldTimeStamp: number =
        geoInfos.get(vendorId)?.timestamp ?? timestamp;
      console.log({ oldTimeStamp, timestamp });

      if (markers.get(vendorId) == null) {
        const marker = new Marker().setLngLat([lng, lat]);
        markers.set(vendorId, marker);
        marker.addTo(map);
      }

      const marker = markers.get(vendorId) as Marker;
      const popup = new Popup({ offset: 25 }).setHTML(`
          <div>
            <h1>${vendor.displayName}</h1>
            <p>${vendor.description}</p>
          </div>
        `);

      marker.setPopup(popup);
      geoInfos.set(vendorId, info);

      const duration = timestamp - oldTimeStamp;
      if (duration > 0) {
        mapboxService.animateMarker(marker, new LngLat(lng, lat), duration);
      }
    });
  }

  ngAfterViewInit() {
    const { mapboxService, containerId } = this;

    mapboxService.draw(containerId, 103.851959, 1.29027, 12);
    mapboxService.removeCopyrightText();
    mapboxService.map.resize();
  }
}
