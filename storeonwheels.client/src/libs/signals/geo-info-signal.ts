import { signal } from "@preact/signals-react";
import { GeoInfo } from "~/libs/models";

export const geoInfo$ = signal<GeoInfo>(new GeoInfo());
