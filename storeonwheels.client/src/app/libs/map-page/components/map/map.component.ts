import { CommonModule } from "@angular/common";
import { AfterViewInit, Component, OnInit } from "@angular/core";
import {
  HUB_CONNECTION,
  MAPBOX_TOKEN,
  MapboxService,
  MessageHubService,
  hubConnection,
  mapboxToken,
} from "~/app/libs/map-page/services";
import { GeoInfo } from "~/app/libs/map-page/models";
import { LngLat, Marker, Popup } from "mapbox-gl";
import { Lru } from "toad-cache";
import "mapbox-gl/dist/mapbox-gl.css";

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule],
  providers: [
    MapboxService,
    MessageHubService,
    { provide: MAPBOX_TOKEN, useValue: mapboxToken },
    { provide: HUB_CONNECTION, useValue: hubConnection },
  ],
  templateUrl: './map.component.html',
  styleUrl: './map.component.css'
})
export class MapComponent implements OnInit, AfterViewInit {
  public geoInfo = new GeoInfo();
  public searchboxId = "searchbox"
  public containerId = "foodtruck-mapbox";
  private markers = new Lru<Marker>();
  private geoInfos = new Lru<GeoInfo>();

  constructor(
    private messageHub: MessageHubService,
    private mapboxService: MapboxService
  ) {
    messageHub.start();
    messageHub.sendMockPeriodically();
  }

  ngOnInit() {
    const { markers, messageHub, geoInfos, mapboxService, customMarker } = this;

    messageHub.geoInfo$.subscribe((info: GeoInfo) => {
      if (mapboxService.map == null) {
        return;
      }

      const { map } = mapboxService;
      this.geoInfo = info;

      const { vendorId, vendor, coords, timestamp } = info;
      const { latitude: lat, longitude: lng, heading } = coords;

      const oldTimeStamp: number =
        geoInfos.get(vendorId)?.timestamp ?? timestamp;
      console.log({ oldTimeStamp, timestamp });

      if (markers.get(vendorId) == null) {
        const marker: Marker = customMarker.setLngLat([lng, lat]);
        markers.set(vendorId, marker);
        marker.addTo(map);
      }

      const marker = markers.get(vendorId) as Marker;
      const popup = new Popup({ offset: 25 }).setHTML(`
          <div class="text-black">
            <h1>${vendor.displayName}</h1>
            <p>${vendor.description}</p>
          </div>
        `);

      marker.setPopup(popup);
      marker.setRotation(heading);
      geoInfos.set(vendorId, info);

      const duration = timestamp - oldTimeStamp;
      if (duration > 0) {
        mapboxService.animateMarker(marker, new LngLat(lng, lat), duration);
      }
    });
  }

  ngAfterViewInit() {
    const { mapboxService, containerId, searchboxId } = this;

    mapboxService.draw(containerId, searchboxId, 103.851959, 1.29027, 12);
    mapboxService.removeCopyrightText();
    mapboxService.map.resize();
  }

  private get customMarker(): Marker {
    const width = 20;
    const height = 20;
    const el: HTMLDivElement = document.createElement("div");
    el.className = "marker";
    el.style.width = `${width}px`;
    el.style.height = `${height}px`;
    el.style.backgroundSize = "100%";
    el.style.backgroundImage = `url(/assets/navigation.png)`;
    return new Marker(el);
  }
}
