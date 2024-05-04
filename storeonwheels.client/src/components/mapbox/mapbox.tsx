import { useEffect, useRef, useState } from "react";
import { DefaultMapBox, removeCopyrightText } from "./default-mapbox";
import mapboxgl from "mapbox-gl";
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
	const defaultLng = 103.8198;
	const defaultLat = 1.3521;
	const defaultZoom = 9;
	const [lng, setLng] = useState(defaultLng);
	const [lat, setLat] = useState(defaultLat);
	const [zoom, setZoom] = useState(defaultZoom);

	useEffect(() => {
		// initialize map only once
		if (mapContainer.current == null) {
			return;
		}

		// Create a MapBox with zoom control, rotation control, and geolocation control
		const mb = new DefaultMapBox(mapContainer.current.id, defaultLat, defaultLng, defaultZoom);
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
			const _lng: string = map.getCenter().lng.toFixed(4);
			const _lat: string = map.getCenter().lat.toFixed(4);
			const _zoom: string = map.getZoom().toFixed();

			setLng(parseFloat(_lng));
			setLat(parseFloat(_lat));
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
