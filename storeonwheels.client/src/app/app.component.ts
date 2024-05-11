import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import axios from 'axios';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
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
