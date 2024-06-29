import { AfterViewInit, Component } from "@angular/core";
import { GeolocateService } from "~/app/libs/shared/services";

@Component({
  selector: "app-broadcast-page",
  standalone: true,
  imports: [],
  templateUrl: "./broadcast-page.component.html",
  styleUrl: "./broadcast-page.component.css",
})
export class BroadcastPageComponent implements AfterViewInit {
  constructor(private geoService: GeolocateService) {}

  async ngAfterViewInit() {
    await this.geoService.watchPosition(5000);
  }
}
