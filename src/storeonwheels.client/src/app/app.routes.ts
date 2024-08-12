import { Routes } from "@angular/router";
import { MapPage, BroadcastPage, HealthcheckPage } from "~/app/pages/index";

export const routes: Routes = [
  { path: "map", component: MapPage, title: "Map" },
  { path: "broadcast", component: BroadcastPage, title: "Broadcast" },
  { path: "healthcheck", component: HealthcheckPage, title: "Health Check" },
  { path: "", redirectTo: "/map", pathMatch: "full" },
];
