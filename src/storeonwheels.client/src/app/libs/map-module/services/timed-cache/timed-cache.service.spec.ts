import { TestBed } from "@angular/core/testing";

import { TickerCache } from "./ticker-cache.service";
import { SleepService } from "~/app/libs/shared-module";

describe("TimeoutCacheService", () => {
  let cache: TickerCache<string, number>;
  let sleeper: SleepService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TickerCache, SleepService],
    });
    cache = TestBed.inject(TickerCache);
    sleeper = TestBed.inject(SleepService);
  });

  it("should be created", () => {
    expect(cache).toBeTruthy();
  });

  it("item should be accessible", () => {
    cache.set("one", 1);
    const value: number | undefined = cache.get("one");
    expect(value).toBe(1);
    expect(cache.has("one")).toBeTruthy();
  });

  it("item should be removed", () => {
    cache.set("one", 1);
    const isPresent: boolean = cache.delete("one");
    expect(isPresent).toBeTruthy();

    const value: number | undefined = cache.get("one");
    expect(value).toBeUndefined();
  });

  it("item should be evicted after timeout", async () => {
    cache.set("one", 1);
    cache.setTimer("one", Date.now() + 1000, () => {
      cache.delete("one");
    });
    expect(cache.has("one")).toBeTruthy();

    await sleeper.sleep(3000);
    expect(cache.has("one")).toBeFalsy();
  });

  it("callback should work", async () => {
    let msg = "";
    cache.set("one", 1);
    cache.setTimer("one", Date.now() + 1000, () => {
      msg = "callback executed";
    });

    await sleeper.sleep(3000);
    expect(msg).toBe("callback executed");
  });
});
