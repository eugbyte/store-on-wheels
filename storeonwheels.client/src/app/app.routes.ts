import { Routes } from '@angular/router';
import { MapboxComponent } from './pages/mapbox/mapbox.component';

export const routes: Routes = [
  { path: 'map', component: MapboxComponent, title: "Mapbox" },
];
