import { Injectable } from "@angular/core";
import { MinPriorityQueue } from "@datastructures-js/priority-queue";
import { TimeoutInfo } from "./timeout-info";
import cloneDeep from "lodash.clonedeep";
import { timeout } from "rxjs";

// https://tinyurl.com/3vcu8xsb
@Injectable({
  providedIn: null,
})
export class TimeoutCache<K, V> extends Map<K, V> {
  private id: ReturnType<typeof setTimeout>;
  private timeouts = new Map<K, TimeoutInfo>();
  private minQ = new MinPriorityQueue<K>(
    (key) => this.timeouts.get(key)?.timestamp ?? 0
  );

  constructor() {
    super();
    const { minQ, timeouts } = this;

    this.id = setInterval(async () => {
      while (!minQ.isEmpty()) {
        const key: K = minQ.front();
        // timeout may be null if delete() was called before the setInterval runs
        const timeout: TimeoutInfo | undefined = timeouts.get(key);

        if (timeout != null && Date.now() < timeout.timestamp) {
          // the items in the minQ are strictly increasing,
          // so if the current item has yet to expire, the other items in the queue definitely has not expired
          break;
        }

        minQ.dequeue();

        // cache key has expired
        try {
          await timeout?.callback();
        } catch (err) {
          console.error(err);
        }
      }
    }, 1000);
  }

  /**
   * Remember to call `dispose()` before unMounting the component, as TimeoutCache uses setInterval internally
   */
  dispose() {
    clearInterval(this.id);
  }

  /**
   * Set the expiry duration for the item in the cache.
   * A 1 to 1 mapping of the item against the expiry date. Calling this method consecutively will overwrite the previous expiry date.
   * If setTimer was called previously, and called again with an earlier timestamp before the previous timestamp, time complexity will be `O(log(n) + n)`,
   * as the item needs to be removed from the heap.
   * In all other cases, time complexity is `O(log(n))`.
   * @param key the key of the item in the cache which will expire.
   * @param timestamp the date time in Unix timestamp
   * @param callback the callback function which will execute upon expiry.
   */
  setTimer(key: K, timestamp: number, callback: () => void | Promise<void>) {
    const { minQ, timeouts } = this;
    const ttl = timestamp - Date.now();

    const prev: TimeoutInfo | undefined = timeouts.get(key);
    if (prev != null && timestamp < prev.timestamp) {
      minQ.remove((k) => k === key);
    }

    minQ.enqueue(key);
    timeouts.set(key, { ttl, timestamp, callback });
  }

  override delete(key: K): boolean {
    const { timeouts } = this;
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
