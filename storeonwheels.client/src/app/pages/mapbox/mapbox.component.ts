import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MapboxService, MessageHubService, mapboxProvider, messageHubProvider } from '~/app/libs/services';
import { GeoInfo } from '~/app/libs/models';

const 

@Component({
  selector: 'app-mapbox',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mapbox.component.html',
  styleUrl: './mapbox.component.css',
  providers: [
    messageHubProvider,
    mapboxProvider,
  ]
})
export class MapboxComponent implements OnInit {
  public geoInfo = new GeoInfo();

  constructor(private messageHub: MessageHubService, private mapboxService: MapboxService) {
    this.messageHub.start();
}

  ngOnInit() {
    this.messageHub.geoInfo$.subscribe((info) => {
      this.geoInfo = info;
    });
    this.messageHub.periodicSendMock();
  }
}
