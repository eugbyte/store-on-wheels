import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import {
  MapComponent,
  VendorTableComponent,
} from "~/app/libs/map-page/components";
import { MessageHubService } from "~/app/libs/map-page/services";
import { GeoInfo } from "~/app/libs/shared/models";
import { Observable } from "rxjs";

@Component({
  selector: "app-map-page",
  standalone: true,
  imports: [CommonModule, MapComponent, VendorTableComponent],
  templateUrl: "./map-page.component.html",
  styleUrl: "./map-page.component.css",
})
export class MapPageComponent implements OnInit {
  public geoInfo$: Observable<GeoInfo>;

  constructor(private messageHub: MessageHubService) {
    this.geoInfo$ = messageHub.geoInfo$;
  }

  async ngOnInit() {
    this.messageHub.start();
  }
}
