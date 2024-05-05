import { useEffect, useRef, useState } from "react";
import { DefaultMapBox } from "./default-mapbox";
import mapboxgl, { LngLat } from "mapbox-gl";
import { getPermissionState } from "~/libs/geolocator";
import { GeolocateControl } from "mapbox-gl";
import { GeoInfo } from "~/libs/models";
import { produce } from "immer";
import { HubConnection } from "@microsoft/signalr";
import { useMessageHub } from "~/libs/hooks/use-message-hub";

interface Props {
  className?: string;
  connection: HubConnection;
}

export function MapBox({ className = "", connection }: Props): JSX.Element {
  const { geoInfo } = useMessageHub(connection);
  const [geoInfos, setGeoInfos] = useState<Record<string, GeoInfo>>({});

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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (geoInfo == null) {
      return;
    }
    const copy = produce((draft: Record<string, GeoInfo>) => {
      draft[geoInfo.vendorId] = geoInfo;
    });
    setGeoInfos(copy);
   
  }, [geoInfo]);

  useEffect(() => {
    if (map == null || geolocator == null) {
      return;
    }
    map.on("load", async () => {
      map.resize();
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
      <span>ConnectionId: {connection?.connectionId}</span>
      <pre style={{ textAlign: "left" }}>{JSON.stringify(geoInfo, null, 2)}</pre>
      <main id="map_store_on_wheels" ref={mapContainer} style={{ height: "500px" }} />
    </div>
  );
}
