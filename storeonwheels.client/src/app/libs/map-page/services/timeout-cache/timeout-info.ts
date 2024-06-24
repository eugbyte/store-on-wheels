/**
 * Info for priority queue
 */
export interface TimeoutInfo {
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

export interface QueueInfo<K> {
  item: K;
  priority: number;
}
