import { Injectable } from "@angular/core";
import { MinPriorityQueue } from "@datastructures-js/priority-queue";
import { TimeoutInfo } from "./timeout-info";

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
  private queue = new MinPriorityQueue<TimeoutInfo>();

  constructor() {
    super();
    const { minQ, timeouts } = this;

    this.id = setInterval(async () => {
      // either expiry date has passed, or that the this.delete() was called before setInterval runs
      while (!minQ.isEmpty()) {        
        const key: K = minQ.dequeue();
        const timeout = timeouts.get(key);

        if (timeout == null) {
          // this.delete() was called before interval callback was executed
          continue;
        } else if (Date.now() < timeouts.get(key)!.expiry) {
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

  clearInterval() {
    clearInterval(this.id);
  }

  setTimeout(key: K, ttl: number, callback?: () => void | Promise<void>) {
    const { minQ, timeouts } = this;
    minQ.enqueue(key);
    timeouts.set(key, { ttl, expiry: Date.now() + ttl, callback });
  }

  override get(key: K): V | undefined {
    const { timeouts } = this;
    const timeout = timeouts.get(key);
    if (timeout != null) {
      timeouts.set(key, { ...timeout, expiry: timeout.ttl + Date.now() });
    }
    return super.get(key);
  }

  override has(key: K): boolean {
    const { timeouts } = this;
    const timeout = timeouts.get(key);
    if (timeout != null) {
      timeouts.set(key, { ...timeout, expiry: timeout.ttl + Date.now() });
    }
    return super.has(key);
  }

  override set(key: K, value: V): this {
    const { timeouts } = this;
    const timeout = timeouts.get(key);
    if (timeout != null) {
      timeouts.set(key, { ...timeout, expiry: timeout.ttl + Date.now() });
    }

    return super.set(key, value);
  }

  override delete(key: K): boolean {
    const { timeouts } = this;
    timeouts.delete(key);
    return super.delete(key);
  }

  getTimeouts(): TimeoutInfo[] {
    return Array.from(this.timeouts.values());
  }
}
