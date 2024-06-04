import mapboxgl, {
  GeolocateControl,
  LngLat,
  Marker,
  NavigationControl,
} from "mapbox-gl";
import * as turf from "@turf/turf";
import { animate } from "./animate";
import { Inject, Injectable } from "@angular/core";
import { MAPBOX_TOKEN } from "./mapbox.service.provider";
import { MapboxSearchBox } from "@mapbox/search-js-web";

/**
 * Create a MapBox with zoom control, rotation control, geolocation control and a search box.
 * 
 * Use it like so:
 * ```
  const mb = new DefaultMapBox("div_id", lng, lat);
  mb.draw();
  const { map, navControl, geolocater } = mb;	// access the mapboxgl.Map, NavigationControl, GeolocateControl here.
 * ```
 */
@Injectable()
export class MapboxService {
  private _map?: mapboxgl.Map;
  navControl: NavigationControl;
  geolocater: GeolocateControl;
  searchBox: MapboxSearchBox;

  /**
   * Instantiate the mapbox object.
   *
   * Note that there is no side effects. The map will only be rendered to the HTML after calling render().
   * @param containerID The HTML ID of the container element for the MapBox to attach itself to
   * @param lng default lattitude
   * @param lat default longitude
   * @param zoom default zoom
   */
  constructor(@Inject(MAPBOX_TOKEN) mapboxToken: string) {
    mapboxgl.accessToken = mapboxToken;

    // 1. Create zoom and rotation controls.
    this.navControl = new NavigationControl();

    // 2. Create geolocation controls.
    this.geolocater = new GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true,
      },
      // Draw an arrow next to the location dot to indicate which direction the device is heading.
      showUserHeading: true,
    });

    // 3. Create the searchbox control
    this.searchBox = new MapboxSearchBox();
    const { searchBox } = this;
    searchBox.accessToken = mapboxToken;
    searchBox.options = {
      language: "en",
      country: "SG",
    };
  }

  /**
   * As a side effect, render the Map to the HTML.
   * Note that there is no side effects. The map will only be rendered to the HTML after calling render().
   * @param containerID The HTML ID of the container element for the MapBox to attach itself to
   * @param lng default lattitude
   * @param lat default longitude
   * @param zoom default zoom
   */
  draw(containerID: string, lng: number, lat: number, zoom: number) {
    const { navControl, geolocater, searchBox } = this;

    const map = new mapboxgl.Map({
      container: containerID,
      style: "mapbox://styles/mapbox/streets-v12", // style URL
      zoom,
      center: [lng, lat],
    });
    this._map = map;
    
    // 1. Attach the search box control
    // set the mapboxgl library to use for markers and disable the marker functionality
    searchBox.mapboxgl = mapboxgl;
    searchBox.marker = false;
    // bind the search box instance to the map instance
    searchBox.bindMap(map);
    // add the search box instance to the DOM
    document.getElementById("searchbox")?.appendChild(searchBox as HTMLElement);

    // 2. Attach zoom and rotation controls to the rendered map.
    map.addControl(navControl);
    // 3. Attach geolocation to the rendered map.
    map.addControl(geolocater);
  }

  /**
   * Get the Map object, asserting that it is not null.
   * The mapbox will be null if it not been called with draw()
   */
  get map(): mapboxgl.Map {
    if (this._map == null) {
      throw new Error(
        "map is null. Remember to call draw() to initialize the map."
      );
    }
    return this._map;
  }

  removeCopyrightText(): void {
    const copyright = document.querySelector(".mapboxgl-ctrl-attrib-inner");
    if (copyright != null) {
      copyright.remove();
    }
  }

  /**
   * Animate the marker moving from its original coordinates to the destination.
   * Mapbox already uses [Web Workers under the hood](https://docs.mapbox.com/mapbox-gl-js/guides/install/#loading-and-transpiling-the-web-worker-separately)
   * to draw the canvas, so there is no need to implement a web worker.
   * @param marker The MapBox marker object
   * @param geoInfo Geo info of the vendor
   * @param animationDuration How long the animation should run in millisecond
   * @param frameID The animation frame ID, single element array to store reference to the current animation frame
   */
  animateMarker(
    marker: Marker,
    destination: LngLat,
    animationDuration: number,
    frameID: [number] = [0]
  ): void {
    // code for animation here
    const { lng, lat } = marker.getLngLat();
    const { lng: finalLng, lat: finalLat } = destination;

    const from = turf.point([lng, lat]);
    const to = turf.point([finalLng, finalLat]);

    const bearing = turf.rhumbBearing(from, to);
    const distance = turf.distance(from, to, { units: "meters" });

    if (animationDuration == 0) {
      return;
    }
    const speed = distance / (animationDuration / 1000); // m/s
    animate({
      marker,
      speed,
      animationDuration,
      bearing,
      originlng: lng,
      originlat: lat,
      startTime: window.performance.now(),
      timestamp: window.performance.now(),
      frameID,
    });
  }
}
