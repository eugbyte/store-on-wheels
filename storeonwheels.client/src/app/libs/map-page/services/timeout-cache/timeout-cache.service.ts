import { Injectable } from "@angular/core";
import { MinPriorityQueue } from "@datastructures-js/priority-queue";
import { TimeoutInfo } from "./timeout-info";
import cloneDeep from "lodash.clonedeep";

// https://tinyurl.com/3vcu8xsb
@Injectable({
  providedIn: null,
})
export class TimeoutCacheService<K, V> extends Map<K, V> {
  private id: ReturnType<typeof setTimeout>;
  private timeouts = new Map<K, TimeoutInfo>();
  private minQ = new MinPriorityQueue<K>(
    (key) => this.timeouts.get(key)?.expiry ?? 0
  );

  constructor() {
    super();
    const { minQ, timeouts } = this;

    this.id = setInterval(async () => {
      // either expiry date has passed, or that the this.delete() was called before setInterval runs
      while (!minQ.isEmpty()) {
        const key: K = minQ.dequeue();
        const timeout = timeouts.get(key);
        console.log("dequeued:", timeout, "now: ", Date.now());

        if (timeout == null) {
          // this.delete() was called before interval callback was executed
          continue;
        } else if (Date.now() < timeout.expiry) {
          console.log("requeuing...");
          minQ.enqueue(key);
          break;
        }

        // cache key has expired
        try {
          if (timeout.callback != null) {
            await timeout.callback();
          }
        } catch (err) {
          console.error(err);
        } finally {
          // execute the delete last in case callback references the hashmap
          super.delete(key);
          timeouts.delete(key);
        }
      }
    }, 1000);
  }

  /**
  * Remember to call cleanUp before unMounting the component, as TimeoutCache uses setInterval internally
  */
  cleanUp() {
    clearInterval(this.id);
  }

  /**
   * Set the expiry duration for the item in the cache.
   * A 1 to 1 mapping of the item against the expiry date. Calling this method consecutively will overwrite the previous expiry date.
   * @param key the key of the item in the cache which will expire.
   * @param expiry the expiry time in Unix timestamp
   * @param callback the callback function which will execute upon expiry.
   */
  setExpiry(key: K, expiry: number, callback?: () => void | Promise<void>) {
    const { minQ, timeouts } = this;
    const ttl = expiry - Date.now();

    minQ.enqueue(key);
    timeouts.set(key, { ttl, expiry, callback });
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
