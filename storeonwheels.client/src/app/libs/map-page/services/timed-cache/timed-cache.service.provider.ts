import { TimeoutCache } from "./timed-cache-2.service";
import { TickerCache } from "./timed-cache.service";
import { TimedMap } from "./timeout-info";

export enum Strategy {
  HEAP = 0,
  SET_TIMEOUTS,
}

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Event_loop#adding_messages
// https://developer.mozilla.org/en-US/docs/Web/API/setTimeout#reasons_for_delays_longer_than_specified
export function timedMapFactory<K, V>(
  strategy = Strategy.HEAP
): TimedMap<K, V> {
  switch (strategy) {
    case Strategy.HEAP:
      return new TickerCache();
    case Strategy.SET_TIMEOUTS:
      return new TimeoutCache();
    default:
      return new TickerCache();
  }
}
