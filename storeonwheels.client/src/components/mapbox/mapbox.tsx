import { useEffect, useRef, useState } from "react";
import { DefaultMapBox, removeCopyrightText } from "./default-mapbox";
import mapboxgl, { LngLat } from "mapbox-gl";
import { getPermissionState } from "~/libs/geolocator";
import { GeolocateControl } from "mapbox-gl";
import { GeoInfo } from "~/libs/models";

interface Props {
  className: string;
  geoInfo: GeoInfo;
}

export function MapBox({ className, geoInfo }: Props): JSX.Element {
  const mapContainer = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<mapboxgl.Map>();
  const [geolocator, setGeolocator] = useState<GeolocateControl>();
  const [lngLat, setLngLat] = useState(new LngLat(103.8198, 1.3521));
  const [zoom, setZoom] = useState(12);

  useEffect(() => {
    console.log("geoEffect changed");
  }, [geoInfo]);

  useEffect(() => {
    // initialize map only once
    if (mapContainer.current == null) {
      return;
    }

    console.log("id", mapContainer.current.id);

    // Create a MapBox with zoom control, rotation control, and geolocation control
    const mb = new DefaultMapBox(mapContainer.current.id, lngLat.lng, lngLat.lat, zoom);
    mb.draw();
    setMap(mb.map);
    setGeolocator(mb.geolocater);
  }, []);

  useEffect(() => {
    if (map == null || geolocator == null) {
      return;
    }
    map.on("load", async () => {
      map.resize();
      removeCopyrightText();
      const permission = await getPermissionState();
      if (permission == "granted") {
        geolocator.trigger();
      }
    });

    map.on("move", () => {
      setLngLat(map.getCenter());
      const _zoom: string = map.getZoom().toFixed();
      setZoom(parseFloat(_zoom));
    });
  }, [map, geolocator]);

  return (
    <div className={className}>
      <main id="map_store_on_wheels" ref={mapContainer} style={{ height: "400px" }} />
      <p className="text-xs">© Mapbox © OpenStreeMap</p>
    </div>
  );
}
