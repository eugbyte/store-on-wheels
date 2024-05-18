import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import axios from 'axios';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  standalone: true,
  imports: [HttpClientModule, RouterModule],
})
export class AppComponent implements OnInit {
  public message = "";

  constructor() {}

  async ngOnInit() {
    const response: Record<string, string> = (await axios.get("api/v1/heartbeat")).data;
    this.message = response["message"];
  }

  title = 'storeonwheels.client';
}
