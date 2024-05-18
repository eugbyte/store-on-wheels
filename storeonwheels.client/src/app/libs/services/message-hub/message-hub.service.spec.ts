import { TestBed } from '@angular/core/testing';

import { MessageHubService } from './message-hub.service';

describe('MessageHubService', () => {
  let service: MessageHubService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MessageHubService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
