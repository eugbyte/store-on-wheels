import { TestBed } from "@angular/core/testing";

import { TimeoutCacheService } from "./timeout-cache.service";

describe("TimeoutCacheService", () => {
  let service: TimeoutCacheService<string, number>;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TimeoutCacheService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("item should be accessible", () => {
    service.set("one", 1);
    const value: number | undefined = service.get("one");
    expect(value).toBe(1);
  });

  it("item should be removed", () => {
    service.set("one", 1);
    const isPresent: boolean = service.delete("one");
    expect(isPresent).toBeTruthy();

    const value: number | undefined = service.get("one");
    expect(value).toBeUndefined();
  });
});
