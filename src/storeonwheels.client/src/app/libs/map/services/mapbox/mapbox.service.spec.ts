import { TestBed } from "@angular/core/testing";

import { MapboxService } from "./mapbox.service";
import { MAPBOX_TOKEN, mapboxToken } from "./mapbox.service.provider";

describe("MapboxService", () => {
  let service: MapboxService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: MAPBOX_TOKEN, useValue: mapboxToken },
      ],
    });
    service = TestBed.inject(MapboxService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
