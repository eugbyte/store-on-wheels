import { CommonModule } from "@angular/common";
import {
  AfterViewInit,
  Component,
  Inject,
  Input,
  OnDestroy,
  OnInit,
} from "@angular/core";
import {
  MAPBOX_TOKEN,
  MapboxService,
  TimedMap,
  mapboxToken,
  CLICK_SUBJECT,
  ClickProps,
  clickSubject as _clickSubject,
  timedMapFactory,
} from "~/app/pages/map-page/services";
import { GeoInfo } from "~/app/shared/models";
import { LngLat, Marker, Popup } from "mapbox-gl";
import { BehaviorSubject, Observable } from "rxjs";

@Component({
  selector: "app-map",
  standalone: true,
  imports: [CommonModule],
  providers: [
    MapboxService,
    { provide: MAPBOX_TOKEN, useValue: mapboxToken },
    { provide: CLICK_SUBJECT, useValue: _clickSubject },
    {
      provide: "TimedMap1",
      useFactory: timedMapFactory,
    },
    {
      provide: "TimedMap2",
      useFactory: timedMapFactory,
    },
  ],
  templateUrl: "./map.component.html",
  styleUrl: "./map.component.css",
})
export class MapComponent implements OnInit, AfterViewInit, OnDestroy {
  public searchboxId = "searchbox";
  public containerId = "foodtruck-mapbox";

  @Input({ required: true }) geoInfo$: Observable<GeoInfo> = new Observable();

  constructor(
    private mapboxService: MapboxService,
    @Inject(CLICK_SUBJECT) private clickSubject: BehaviorSubject<ClickProps>,
    @Inject("TimedMap1") private markers: TimedMap<string, Marker>,
    @Inject("TimedMap2") private geoInfos: TimedMap<string, GeoInfo>
  ) {}

  ngOnInit() {
    const { geoInfo$, clickSubject } = this;

    geoInfo$.subscribe((info: GeoInfo) => this.updateMarkers(info));
    clickSubject.subscribe((clickEvent: ClickProps) =>
      this.updatePopup(clickEvent)
    );
  }

  ngAfterViewInit() {
    const { mapboxService, containerId, searchboxId } = this;

    mapboxService.draw(containerId, searchboxId, 103.851959, 1.29027, 12);
    mapboxService.removeCopyrightText();
    mapboxService.map?.resize();
  }

  ngOnDestroy() {
    const { markers, geoInfos } = this;
    markers.dispose();
    geoInfos.dispose();
  }

  private updateMarkers(info: GeoInfo) {
    const { markers, geoInfos, mapboxService, clickSubject } = this;

    if (mapboxService.map == null) {
      return;
    }
    const { map } = mapboxService;
    const { vendorId, vendor, coords, timestamp } = info;
    const { latitude: lat, longitude: lng, heading } = coords;

    const oldTimeStamp: number = geoInfos.get(vendorId)?.timestamp ?? timestamp;

    if (!markers.has(vendorId)) {
      const marker: Marker = this.customMarker().setLngLat([lng, lat]);
      marker.addTo(map);

      markers.set(vendorId, marker);

      const popup = new Popup({ offset: 25 }).setHTML(`
          <div class="text-black" id="custom_popup">
            <p>
              <b>${vendor.displayName}</b>
            </p>
            <p>${vendor.description}</p>
          </div>
        `);

      marker.setPopup(popup);
      marker
        .getElement()
        .addEventListener("click", () =>
          clickSubject.next({ vendorId, source: "MapComponent" })
        );
    }

    const marker = markers.get(vendorId) as Marker;
    marker.setRotation(heading ?? 0);
    geoInfos.set(vendorId, info);

    const duration = timestamp - oldTimeStamp;
    if (duration > 0) {
      mapboxService.animateMarker(marker, new LngLat(lng, lat), duration);
    }

    markers.setTimer(vendorId, Date.now() + 5000, () => {
      marker.remove();
      markers.delete(vendorId);
    });
    geoInfos.setTimer(vendorId, Date.now() + 5000, () => {
      geoInfos.delete(vendorId);
    });
  }

  private updatePopup({ vendorId, source }: ClickProps) {
    const { markers, geoInfos, mapboxService } = this;
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
        marker.getPopup()?.remove();
      }
      // display popup
      marker.getPopup()?.addTo(map);
    }
  }

  private customMarker(): Marker {
    const width = 20;
    const height = 20;
    const el: HTMLDivElement = document.createElement("div");
    el.id = "custom_marker";
    el.className = "marker";
    el.style.width = `${width}px`;
    el.style.height = `${height}px`;
    el.style.backgroundSize = "100%";
    el.style.backgroundImage = `url(/assets/navigation.png)`;
    return new Marker(el);
  }
}
