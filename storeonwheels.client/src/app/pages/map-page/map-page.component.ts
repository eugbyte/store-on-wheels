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
import { Marker, Popup } from "mapbox-gl";
import { Lru } from 'toad-cache';
import 'mapbox-gl/dist/mapbox-gl.css';

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
      const { vendorId, vendor, coords } = info;
      const { latitude: lat, longitude: lng } = coords;

      let [oldLng, oldLat] = [lng, lat];

      if (markers.get(vendorId) != null) {
        const marker = markers.get(vendorId) as Marker;
        ({ lat: oldLng, lng: oldLat } = marker.getLngLat());
        marker.remove();
      }

      const popup = new Popup({ offset: 25 })
        .setHTML(`
          <div>
            <h1>${vendor.displayName}</h1>
            <p>${vendor.description}</p>
          </div>
        `);

      const marker = new Marker()
        .setLngLat([lng, lat])
        .setPopup(popup);

      marker.addTo(map);
      markers.set(vendorId, marker);
      geoInfos.set(vendorId, info);
    });

  }

  ngAfterViewInit() {
    const { mapboxService, containerId } = this;

    mapboxService.draw(containerId, 103.851959, 1.29027, 12);
    mapboxService.removeCopyrightText();
    mapboxService.map.resize();    
  }
}
