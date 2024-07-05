import { Component, OnInit } from "@angular/core";
import { HubConnectionState } from "@microsoft/signalr";
import axios from "axios";
import { HUB_CONNECTION, MessageHubService, hubConnection } from "~/app/libs/map-page/services";

@Component({
  selector: "app-healthcheck-page",
  standalone: true,
  imports: [],
  providers: [
    MessageHubService,
    { provide: HUB_CONNECTION, useValue: hubConnection },
  ],
  templateUrl: "./healthcheck-page.component.html",
  styleUrl: "./healthcheck-page.component.css",
})
export class HealthcheckComponent implements OnInit {
  public message = "";
  title = "healthcheck";
  wsState: HubConnectionState = this.messageHub.state;
  wsUrl = "";

  constructor(private messageHub: MessageHubService) {}

  async ngOnInit() {
    const response: Record<string, string> = (
      await axios.get("api/v1/healthchecks")
    ).data;
    this.message = response["message"];

    const { messageHub } = this;
    await messageHub.start();
    this.wsState = messageHub.state;
    this.wsUrl = hubConnection.baseUrl;
    console.log({ connId: hubConnection.connectionId, state: hubConnection.state });    
  }
}

