import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { HUB_CONNECTION_TOKEN, MessageHubService, hubConnection } from '~/app/libs/services';

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
export class MapboxComponent {
  constructor(private messageHub: MessageHubService) {
    
  }
}
