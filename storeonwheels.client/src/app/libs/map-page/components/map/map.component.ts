import { CommonModule } from "@angular/common";
import { AfterViewInit, Component, Inject, Input, OnInit } from "@angular/core";
import {
  HUB_CONNECTION,
  MAPBOX_TOKEN,
  MapboxService,
  MessageHubService,
  hubConnection,
  mapboxToken,
} from "~/app/libs/map-page/services";
import { GeoInfo } from "~/app/libs/shared/models";
import { LngLat, Marker, Popup } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { BehaviorSubject, Subject } from "rxjs";
import { CLICK_SUBJECT, clickSubject as _clickSubject } from "~/app/libs/shared/services";

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule],
  providers: [
    MapboxService,
    MessageHubService,
    { provide: MAPBOX_TOKEN, useValue: mapboxToken },
    { provide: HUB_CONNECTION, useValue: hubConnection },
    { provide: CLICK_SUBJECT, useValue: _clickSubject },
  ],
  templateUrl: './map.component.html',
  styleUrl: './map.component.css'
})
export class MapComponent implements OnInit, AfterViewInit {
  public searchboxId = "searchbox"
  public containerId = "foodtruck-mapbox";
  private markers = new Map<string, Marker>();
  private geoInfos = new Map<string, GeoInfo>();
  @Input({ required: true }) geoInfo$: Subject<GeoInfo> = new Subject();

  constructor(
    private mapboxService: MapboxService,
    @Inject(CLICK_SUBJECT) private clickSubject: BehaviorSubject<string>) { }

  ngOnInit() {
    const { markers, geoInfos, mapboxService, geoInfo$, clickSubject } = this;

    geoInfo$.subscribe((info: GeoInfo) => {
      if (mapboxService.map == null) {
        return;
      }
      const { map } = mapboxService;
      const { vendorId, vendor, coords, timestamp } = info;
      const { latitude: lat, longitude: lng, heading } = coords;
      console.log({ lat, lng });

      const oldTimeStamp: number =
        geoInfos.get(vendorId)?.timestamp ?? timestamp;

      if (!markers.has(vendorId)) {
        const marker: Marker = this.customMarker().setLngLat([lng, lat]);
        markers.set(vendorId, marker);
        marker.addTo(map);

        const popup = new Popup({ offset: 25 }).setHTML(`
          <div class="text-black">
            <p>
              <b>${vendor.displayName}</b>
            </p>
            <p>${vendor.description}</p>
          </div>
        `);
        marker.setPopup(popup);
        marker.getElement().addEventListener("click", (e) => {
          console.log("marker clicked", vendorId);
          console.log(e);
          clickSubject.next(vendorId);
        });
      }

      const marker = markers.get(vendorId) as Marker;
      marker.setRotation(heading);
      geoInfos.set(vendorId, info);

      const duration = timestamp - oldTimeStamp;
      console.log({ duration });
      if (duration > 0) {
        mapboxService.animateMarker(marker, new LngLat(lng, lat), duration);
      }

    });

    clickSubject.subscribe((vendorId) => {
      if (!(geoInfos.has(vendorId) && markers.has(vendorId))) {
        return;
      }
      if (mapboxService.map == null) {
        return;
      }

      const { map } = mapboxService;
      const marker = markers.get(vendorId);

      if (marker != null && marker.getPopup() != null) {
        map.flyTo({ center: marker.getLngLat() });
        // marker.getPopup().getElement().click();
      }
    });
  }

  ngAfterViewInit() {
    const { mapboxService, containerId, searchboxId } = this;

    mapboxService.draw(containerId, searchboxId, 103.851959, 1.29027, 12);
    mapboxService.removeCopyrightText();
    mapboxService.map.resize();
  }

  private customMarker(): Marker {
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