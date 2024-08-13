import { Routes } from "@angular/router";
import { MapPage, BroadcastPage, HealthcheckPage } from "~/app/pages";

// lazy loading with default export (https://github.com/angular/angular/pull/47586)
export const routes: Routes = [
  { path: "map", title: "Map", component: MapPage },
  {
    path: "broadcast",
    title: "Broadcast",
    loadComponent: () => BroadcastPage,
  },
  {
    path: "healthcheck",
    title: "Health Check",
    loadComponent: () => HealthcheckPage,
  },
  { path: "", redirectTo: "/map", pathMatch: "full" },
];
