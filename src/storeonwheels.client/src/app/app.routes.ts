import { Routes } from "@angular/router";
import { MapPage, BroadcastPage, HealthcheckPage } from "~/app/pages/index";

// lazy loading standalone components: https://v17.angular.io/guide/standalone-components#lazy-loading-and-default-exports
export const routes: Routes = [
  { path: "map", component: MapPage, title: "Map" },
  { path: "broadcast", component: BroadcastPage, title: "Broadcast" },
  { path: "healthcheck", component: HealthcheckPage, title: "Health Check" },
  { path: "", redirectTo: "/map", pathMatch: "full" },
];
