import type { Marker } from "mapbox-gl";
import * as turf from "@turf/turf";

interface AnimateProps {
  /**
   * The mapbox marker
   */
  marker: Marker;
  /**
   * m/s
   */
  speed: number;
  /**
   * Number of ms for animation to run
   */
  animationDuration: number;
  /**
   * Deviance from true north
   */
  bearing: number;
  /**
   * lng of the origin
   */
  originlng: number;
  /**
   * lat of the origin
   */
  originlat: number;
  /**
   * The original [starting time](https://stackoverflow.com/a/21316178) when the animation begins.
   * Determined with `window.performance.now()`
   */
  startTime: number;
  /**
   * The [current time](https://stackoverflow.com/a/21316178) for when requestAnimationFrame starts to fire callbacks.
   * Determined via the timestamp event via `requestAnimationFrame()`
   */
  timestamp: number;
  /**
   * A single element array to store the [ID of the animation frame](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame#return_value).
   * Can pass this value to `window.cancelAnimationFrame(ID)` to cancel the animation
   */
  frameID: [number];
}

export function animate({
  marker,
  speed,
  bearing,
  originlat,
  originlng,
  startTime,
  animationDuration,
  timestamp,
  frameID
}: AnimateProps): void {
  const runtime = timestamp - startTime;

  if (runtime > animationDuration) {
    return;
  }

  const from = turf.point([originlng, originlat]);
  const newPoint = turf.rhumbDestination(from, speed * (runtime / 1000), bearing, {
    units: "meters"
  });
  const [newLng, newLat] = newPoint.geometry.coordinates;

  try {
    marker.setLngLat([newLng, newLat]);
  } catch (err) {
    console.error("race condition where marker is removed");
    return;
  }

  const id = requestAnimationFrame((timestamp) =>
    animate({
      marker,
      speed,
      bearing,
      originlng,
      originlat,
      startTime,
      timestamp,
      animationDuration,
      frameID
    })
  );
  frameID[0] = id;
}
