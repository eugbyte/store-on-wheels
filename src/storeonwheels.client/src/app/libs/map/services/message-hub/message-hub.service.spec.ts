import { TestBed } from "@angular/core/testing";

import { MessageHubService } from "./message-hub.service";
import { HUB_CONNECTION, hubConnection } from "./message-hub.provider";

describe("MessageHubService", () => {
  let service: MessageHubService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: HUB_CONNECTION, useValue: hubConnection },
      ]
    });
    service = TestBed.inject(MessageHubService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
