import { Injectable } from "@angular/core";
import { TimeoutInfo, TimedMap } from "./timeout-info";
import { cloneDeep } from "lodash";

@Injectable({
  providedIn: null,
})
export class TimeoutCache<K, V> extends Map<K, V> implements TimedMap<K, V> {
  private timeouts = new Map<K, TimeoutInfo>();

  /**
   * Remember to call `dispose()` before unmounting the component, as TimeoutCache uses setInterval internally
   */
  dispose() {
    const { timeouts } = this;
    for (const info of timeouts.values()) {
      clearTimeout(info.timeoutId);
    }
  }

  /**
   * Set the expiry duration for the item in the cache.
   * A 1 to 1 mapping of the item against the expiry date. Calling this method consecutively will overwrite the previous expiry date.
   */
  setTimer(key: K, timestamp: number, callback: () => void | Promise<void>) {
    const { timeouts } = this;
    if (timeouts.has(key)) {
      this.delete(key);
    }

    const ttl = timestamp - Date.now();
    const timeoutId = setTimeout(callback, ttl);
    timeouts.set(key, { timeoutId, ttl, timestamp, callback });
  }

  override delete(key: K): boolean {
    const { timeouts } = this;
    const timeoutId = timeouts.get(key)?.timeoutId;
    clearTimeout(timeoutId);

    timeouts.delete(key);
    return super.delete(key);
  }

  getTimeout(key: K): TimeoutInfo | undefined {
    return this.timeouts.get(key);
  }

  getTimeouts(): Map<K, TimeoutInfo> {
    return cloneDeep(this.timeouts);
  }
}
