import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { MapboxComponent } from './pages/mapbox/mapbox.component';

export const routes: Routes = [
  { path: 'map', component: MapboxComponent, title: "Mapbox" },
];
