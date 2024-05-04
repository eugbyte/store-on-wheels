import { useEffect, useRef, useState } from "react";
import { DefaultMapBox, removeCopyrightText } from "./default-mapbox";
import mapboxgl, { LngLat } from "mapbox-gl";
import { getPermissionState } from "~/libs/geolocator";
import { GeolocateControl } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

interface Props {
  className: string;
}

export function MapBox({ className }: Props): JSX.Element {
  const mapContainer = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<mapboxgl.Map>();
  const [geolocator, setGeolocator] = useState<GeolocateControl>();
  const [lngLat, setLngLat] = useState(new LngLat(103.8198, 1.3521));
  const [zoom, setZoom] = useState(12);

  useEffect(() => {
    // initialize map only once
    if (mapContainer.current == null) {
      return;
    }

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
      const perm = await getPermissionState();
      if (perm == "granted") {
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
      <main id="map_store_on_wheels" ref={mapContainer} />
      <p className="text-xs">� Mapbox � OpenStreeMap</p>
    </div>
  );
}
