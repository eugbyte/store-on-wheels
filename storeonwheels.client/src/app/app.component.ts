import { Component, OnDestroy, OnInit } from "@angular/core";
import { FooterNavComponent } from "./libs/shared/components";
import { RouterModule } from "@angular/router";
import {
  HUB_CONNECTION,
  MessageHubService,
  hubConnection,
} from "./libs/map-page/services";
import { ReactiveFormsModule } from "@angular/forms";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.css",
  standalone: true,
  imports: [FooterNavComponent, RouterModule, ReactiveFormsModule],
  providers: [
    { provide: HUB_CONNECTION, useValue: hubConnection },
    MessageHubService,
  ],
})
export class AppComponent implements OnInit, OnDestroy {
  constructor(private messageHub: MessageHubService) {}

  async ngOnInit() {
    await this.messageHub.start();
  }

  async ngOnDestroy() {
    this.messageHub.dispose();
  }
}
