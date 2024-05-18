import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { HUB_CONNECTION_TOKEN, MessageHubService, hubConnection } from '~/app/libs/services';
import { GeoInfo } from '../../libs/models';

@Component({
  selector: 'app-mapbox',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mapbox.component.html',
  styleUrl: './mapbox.component.css',
  providers: [
    { provide: HUB_CONNECTION_TOKEN, useValue: hubConnection },
    MessageHubService,
  ]
})
export class MapboxComponent implements OnInit {
  public geoInfo = new GeoInfo();

  constructor(private messageHub: MessageHubService) {
    this.messageHub.start();
}

  ngOnInit() {
    this.messageHub.geoInfo$.subscribe((info) => {
      this.geoInfo = info;
    });
    this.messageHub.periodicSendMock();
  }
}
