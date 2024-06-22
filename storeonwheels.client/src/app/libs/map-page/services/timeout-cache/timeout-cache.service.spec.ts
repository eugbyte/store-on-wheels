import { TestBed } from "@angular/core/testing";

import { TimeoutCacheService } from "./timeout-cache.service";
import { SleepService } from "~/app/libs/shared/services";

describe("TimeoutCacheService", () => {
  let service: TimeoutCacheService<string, number>;
  let sleep: SleepService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TimeoutCacheService, SleepService],
    });
    service = TestBed.inject(TimeoutCacheService);
    sleep = TestBed.inject(SleepService);
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

  it("item should be evicted after timeout", async () => {
    service.set("one", 1);
    service.setExpiry("one", Date.now() + 1000);
    expect(service.has("one")).toBeTruthy();

    await sleep.sleep(3000);
    expect(service.has("one")).toBeFalsy();
  });

  it("eviction  callback should work", async () => {
    let msg = "";
    service.set("one", 1);
    service.setExpiry("one", Date.now() + 1000, () => {
      msg = "evicted";
      console.log({ msg });
    });

    await sleep.sleep(3000);
    expect(msg).toBe("evicted");
  });
});
