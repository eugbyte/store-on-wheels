import { Component, OnInit } from "@angular/core";
import { HubConnectionState } from "@microsoft/signalr";
import axios from "axios";
import {
  MessageHubService,
  hubConnection,
} from "~/app/libs/map-feature/services";

@Component({
  selector: "app-healthcheck-page",
  standalone: true,
  imports: [],
  templateUrl: "./healthcheck-page.component.html",
  styleUrl: "./healthcheck-page.component.css",
})
export class HealthcheckComponent implements OnInit {
  public message = "";
  title = "healthcheck";
  wsState: HubConnectionState = HubConnectionState.Disconnected;
  wsUrl = "";

  constructor(private messageHub: MessageHubService) {}

  async ngOnInit() {
    const response: Record<string, string> = (
      await axios.get("api/v1/healthchecks")
    ).data;
    console.log({ response });
    this.message = response["message"];
    this.wsUrl = hubConnection.baseUrl;

    const { messageHub } = this;
    messageHub.state$.subscribe((state) => (this.wsState = state.state));
  }
}
