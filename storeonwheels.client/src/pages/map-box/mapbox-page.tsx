import { useEffect, useState } from "react";
import { HubConnection } from "@microsoft/signalr";
import { createConnection, useMessageHub } from "~/libs/hooks/use-message-hub";
import { geoInfo$ } from "~/libs/signals";
import { MapBox } from "~/components/mapbox";
import { GeoInfo } from "~/libs/models";

export function MapBoxPage() {
  const [count, setCount] = useState(0);
  // Important to "freeze" the connection value between re-renders https://legacy.reactjs.org/docs/hooks-reference.html#lazy-initial-state
  const [connection] = useState<HubConnection>(() =>
    createConnection("https://localhost:7108/stream/v1/geohub")
  );
  const { geoInfo } = useMessageHub(connection);

  useEffect(() => {
    if (geoInfo != null) {
      geoInfo$.value = geoInfo;
    }
    console.log("geoInfo updated");
  }, [geoInfo]);

  return (
    <div>
      <span>ConnectionId: {connection?.connectionId}</span>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <pre style={{ textAlign: "left" }}>{JSON.stringify(geoInfo, null, 2)}</pre>
      <MapBox className="" geoInfo={geoInfo ?? new GeoInfo()} />
    </div>
  );
}
