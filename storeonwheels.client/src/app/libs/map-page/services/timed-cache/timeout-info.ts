export type TimeoutId = ReturnType<typeof setTimeout>;

/**
 * Info for priority queue
 */
export interface TimeoutInfo {
  /**
   * Optional dependending on the strategy specified in the factory
   */
  timeoutId?: TimeoutId;
  /**
   * Duration in ms between the time setTimer is called and timestamp
   */
  ttl: number;
  /**
   * The Unix timestamp in ms which to execute the callback
   */
  timestamp: number;
  /**
   * callback that is executed upon expiry
   */
  callback: () => void | Promise<void>;
}

export interface QueueInfo<T> {
  item: T;
  priority: number;
}

export interface TimedMap<K, V> extends Map<K, V> {
  /**
   * Set the expiry duration for the item in the cache.
   * Calling this method consecutively will overwrite the previous expiry date.
   * @param key the key of the item in the cache which will expire.
   * @param timestamp the date time in Unix timestamp
   * @param callback the callback function which will execute upon expiry.
   */
  setTimer(
    key: K,
    timestamp: number,
    callback: () => void | Promise<void>
  ): void;
  /**
   * Remember to call `dispose()` before unmounting the component, to clear all interval / timeouts.
   */
  dispose(): void;

  /**
   * Return the timeout information.
   * @param key the key of the item in the cache which will expire.
   */
  getTimeout(key: K): TimeoutInfo | undefined;
  /**
   * Returns a deep copy of all timeout informations
   */
  getTimeouts(): Map<K, TimeoutInfo>;
}
