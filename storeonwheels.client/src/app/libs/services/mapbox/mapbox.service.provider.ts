import { Provider } from "@angular/core";
import { MapboxService } from "./mapbox.service";

const mapboxToken =
  "pk.eyJ1IjoiZXVnYnl0ZSIsImEiOiJjbHZydWMza3EwZWF0MnFvOTJzcnF5b3U2In0.6yqAJUK9dqvffd5Rcg0-uA";

export const mapboxProvider: Provider = {
  provide: MapboxService,
  useFactory: () => new MapboxService(mapboxToken),
};
