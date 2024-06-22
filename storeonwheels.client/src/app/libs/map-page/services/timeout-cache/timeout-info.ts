/**
 * Info for priority queue
 */
export interface TimeoutInfo {
  /**
   * Expiry duration
   */
  ttl: number;
  /**
   * Expiry Unix timestamp in ms
   */
  expiry: number;
  /**
   * callback that is executed upon expiry
   */
  callback?: () => void | Promise<void>;
}
