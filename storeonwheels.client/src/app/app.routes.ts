import { Routes } from "@angular/router";
import { MapPageComponent as MapPage } from "./pages/map/map.component";

export const routes: Routes = [
  { path: "map", component: MapPage, title: "Mapbox" },
];
