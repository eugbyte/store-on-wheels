import { TestBed } from "@angular/core/testing";

import { TimeoutCacheService } from "./timeout-cache.service";
import { SleepService } from "~/app/libs/shared/services";

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
    expect(service.has("one")).toBeTruthy();
  });

  it("item should be removed", () => {
    service.set("one", 1);
    const isPresent: boolean = service.delete("one");
    expect(isPresent).toBeTruthy();

    const value: number | undefined = service.get("one");
    expect(value).toBeUndefined();
  });

  it("item should be evicted after timeout", async() => {
    service.set("one", 1);
    service.setTimeout({ key: "one", expiry: Date.now() + 1000 });
    expect(service.has("one")).toBeTruthy();

    const sleepService = new SleepService();
    await sleepService.sleep(3000);
    expect(service.has("one")).toBeFalsy();
  });

  it("eviction  callback should work", async () => {
    let msg = "";
    service.set("one", 1);
    service.setTimeout({
      key: "one", expiry: Date.now() + 1000, callback: () => {
          msg = "evicted";
        }
      });

    const sleepService = new SleepService();
    await sleepService.sleep(3000);
    expect(msg).toBe("evicted");
  });
});
