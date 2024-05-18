import { TestBed } from '@angular/core/testing';

import { GeolocateService } from './geolocate.service';

describe('GeolocateService', () => {
  let service: GeolocateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GeolocateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
