import { Routes } from "@angular/router";
import {
  MapPageComponent as MapPage,
  HealthcheckComponent as HealthcheckPage,
  BroadcastPageComponent as BroadcastPage,
} from "./pages";

export const routes: Routes = [
  { path: "map", component: MapPage, title: "Map" },
  { path: "broadcast", component: BroadcastPage, title: "Broadcast" },
  { path: "healthcheck", component: HealthcheckPage, title: "Health Check" },
  { path: "", redirectTo: "/map", pathMatch: "full" },
];
