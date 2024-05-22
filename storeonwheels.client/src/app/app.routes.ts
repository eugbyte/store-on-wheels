import { Routes } from "@angular/router";
import { MapPageComponent as MapPage } from "./pages/map-page/map-page.component";

export const routes: Routes = [
  { path: "map", component: MapPage, title: "Mapbox" },
];
