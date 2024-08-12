import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import {
  MapComponent,
  VendorTableComponent,
} from "~/app/libs/map-feature/components";
import { MessageHubService } from "~/app/libs/map-feature/services";
import { GeoInfo, Vendor } from "~/app/libs/shared/models";
import { Observable, map } from "rxjs";

@Component({
  selector: "app-map-page",
  standalone: true,
  imports: [CommonModule, MapComponent, VendorTableComponent],
  templateUrl: "./map-page.component.html",
  styleUrl: "./map-page.component.css",
})
export default class MapPageComponent implements OnInit {
  geoInfo$: Observable<GeoInfo>;
  vendor$: Observable<Vendor>;

  constructor(private messageHub: MessageHubService) {
    this.geoInfo$ = messageHub.geoInfo$;
    this.vendor$ = this.geoInfo$.pipe(map((info) => info.vendor));
  }

  async ngOnInit() {
    this.messageHub.start();
  }
}
