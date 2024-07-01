import { Component, OnInit } from "@angular/core";
import axios from "axios";

@Component({
  selector: "app-healthcheck-page",
  standalone: true,
  imports: [],
  templateUrl: "./healthcheck-page.component.html",
  styleUrl: "./healthcheck-page.component.css",
})
export class HealthcheckComponent implements OnInit {
  public message = "";

  async ngOnInit() {
    const response: Record<string, string> = (
      await axios.get("api/v1/heartbeats")
    ).data;
    this.message = response["message"];
  }

  title = "healthcheck";
}
