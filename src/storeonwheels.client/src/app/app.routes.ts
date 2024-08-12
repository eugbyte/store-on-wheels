import { Routes } from "@angular/router";
import MapPage from "~/app/pages/map-page/map-page.component";

// lazy loading standalone components: https://v17.angular.io/guide/standalone-components#lazy-loading-and-default-exports
export const routes: Routes = [
  { path: "map", component: MapPage, title: "Map" },
  { path: "broadcast", loadComponent: () => import("./pages/broadcast-page/broadcast-page.component"), title: "Broadcast" },
  { path: "healthcheck", loadComponent: () => import("./pages/healthcheck-page/healthcheck-page.component"), title: "Health Check" },
  { path: "", redirectTo: "/map", pathMatch: "full" },
];
