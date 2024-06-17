import { Injectable } from "@angular/core";
import { MaxPriorityQueue } from "@datastructures-js/priority-queue";

/**
 * Info for priority queue
 */
interface TimeoutInfo<K> {
  // the key in the cache which will be evicted on expiry
  key: K;
  // expiry timestamp in ms
  expiry: number;
  callback?: () => void | Promise<void>;
}

// https://tinyurl.com/3vcu8xsb
@Injectable({
  providedIn: null,
})
export class TimeoutCacheService<K, V> extends Map<K, V> {
  private id: ReturnType<typeof setTimeout>;
  private timeouts = new MaxPriorityQueue<TimeoutInfo<K>>(
    (info) => info.expiry
  );

  constructor() {
    super();
    const { timeouts } = this;
    // eslint-disable-next-line
    const data: Map<K, V> = this;

    this.id = setInterval(async () => {
      console.log("one sec passed");
      while (!timeouts.isEmpty() && Date.now() >= timeouts.front().expiry) {
        const item = timeouts.pop() as TimeoutInfo<K>;
        if (item.callback != null) {
          await item.callback();
        }
        data.delete(item.key);
      }
    }, 1000);
  }

  clearInterval() {
    clearInterval(this.id);
  }

  setTimeout(info: TimeoutInfo<K>) {
    this.timeouts.enqueue(info);
  }

  getTimeouts(): TimeoutInfo<K>[] {
    return this.timeouts.toArray();
  }
}
