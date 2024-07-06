import { Component, OnDestroy, OnInit } from "@angular/core";
import { FooterNavComponent } from "./libs/shared/components";
import { RouterModule } from "@angular/router";
import {
  HUB_CONNECTION,
  MessageHubService,
  hubConnection,
} from "./libs/map-page/services";
import { GeolocateService } from "./libs/broadcast-page/services";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.css",
  standalone: true,
  imports: [FooterNavComponent, RouterModule],
  providers: [
    { provide: HUB_CONNECTION, useValue: hubConnection },
    MessageHubService,
  ],
})
export class AppComponent implements OnInit, OnDestroy {
  constructor(private messageHub: MessageHubService, private geoService: GeolocateService) {}

  async ngOnInit() {
    await this.messageHub.start();
    console.log({ rootState: this.messageHub.state });
  }

  async ngOnDestroy() {
    this.messageHub.dispose();
    this.geoService.dispose();
  }
}
