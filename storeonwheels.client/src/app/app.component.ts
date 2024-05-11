import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import axios from 'axios';
import { HUB_CONNECTION_TOKEN, hubConnection } from './libs/services/message-hub/create-connection';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  standalone: true,
  imports: [HttpClientModule],
  providers: [{ provide: HUB_CONNECTION_TOKEN, useValue: hubConnection }]
})
export class AppComponent implements OnInit {
  public message = "";

  constructor(private http: HttpClient) {}

  async ngOnInit() {
    const response: Record<string, string> = (await axios.get("api/v1/heartbeat")).data;
    this.message = response["message"];
  }

  title = 'storeonwheels.client';
}
