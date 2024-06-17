import { CommonModule } from "@angular/common";
import { AfterViewInit, Component, Inject, Input, OnInit } from "@angular/core";
import {
  HUB_CONNECTION,
  MAPBOX_TOKEN,
  MapboxService,
  TimeoutCacheService as TimeoutCache,
  hubConnection,
  mapboxToken,
} from "~/app/libs/map-page/services";
import { GeoInfo } from "~/app/libs/shared/models";
import { LngLat, Marker, Popup } from "mapbox-gl";
import { BehaviorSubject, Subject } from "rxjs";
import {
  CLICK_SUBJECT,
  ClickProps,
  clickSubject as _clickSubject,
} from "~/app/libs/shared/services";

@Component({
  selector: "app-map",
  standalone: true,
  imports: [CommonModule],
  providers: [
    MapboxService,
    { provide: MAPBOX_TOKEN, useValue: mapboxToken },
    { provide: HUB_CONNECTION, useValue: hubConnection },
    { provide: CLICK_SUBJECT, useValue: _clickSubject },
    TimeoutCache,
  ],
  templateUrl: "./map.component.html",
  styleUrl: "./map.component.css",
})
export class MapComponent implements OnInit, AfterViewInit {
  public searchboxId = "searchbox";
  public containerId = "foodtruck-mapbox";
  private markers = new Map<string, Marker>();
  private geoInfos = new Map<string, GeoInfo>();
  @Input({ required: true }) geoInfo$: Subject<GeoInfo> = new Subject();

  constructor(
    private mapboxService: MapboxService,
    @Inject(CLICK_SUBJECT) private clickSubject: BehaviorSubject<ClickProps>
  ) {}

  ngOnInit() {
    const { markers, geoInfos, mapboxService, geoInfo$, clickSubject } = this;

    geoInfo$.subscribe((info: GeoInfo) => {
      if (mapboxService.map == null) {
        return;
      }
      const { map } = mapboxService;
      const { vendorId, vendor, coords, timestamp } = info;
      const { latitude: lat, longitude: lng, heading } = coords;

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
        marker.getElement().addEventListener("click", () => {
          clickSubject.next({ vendorId, source: "MapComponent" });
        });
      }

      const marker = markers.get(vendorId) as Marker;
      marker.setRotation(heading);
      geoInfos.set(vendorId, info);

      const duration = timestamp - oldTimeStamp;
      if (duration > 0) {
        mapboxService.animateMarker(marker, new LngLat(lng, lat), duration);
      }
    });

    clickSubject.subscribe(({ vendorId, source }) => {
      if (!(geoInfos.has(vendorId) && markers.has(vendorId))) {
        return;
      }
      if (mapboxService.map == null) {
        return;
      }

      const { map } = mapboxService;
      const marker = markers.get(vendorId);

      if (
        marker != null &&
        marker.getPopup() != null &&
        source != "MapComponent"
      ) {
        map.flyTo({ center: marker.getLngLat() });

        // cannot do marker.getElement().click() as this will cause an infinite loop via the clickSubject
        for (const marker of markers.values()) {
          marker.getPopup().remove();
        }
        // display popup
        marker.getPopup().addTo(map);
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
