import { TickerCache } from "./ticker-cache.service";
import { TimeoutCache } from "./timeout-cache.service";
import { TimedMap } from "./timeout-info";

export enum Strategy {
  TICKER = 0,
  TIMEOUTS,
}

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Event_loop#adding_messages
// https://developer.mozilla.org/en-US/docs/Web/API/setTimeout#reasons_for_delays_longer_than_specified
export function timedMapFactory<K, V>(
  strategy = Strategy.TICKER // https://stackoverflow.com/a/57629981/6514532
): TimedMap<K, V> {
  switch (strategy) {
    case Strategy.TICKER:
      return new TickerCache();
    case Strategy.TIMEOUTS:
      return new TimeoutCache();
    default:
      return new TickerCache();
  }
}
