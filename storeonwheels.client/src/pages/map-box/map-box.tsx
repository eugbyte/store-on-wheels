import { useState } from "react";
import { HubConnection } from "@microsoft/signalr";
import { createConnection, useMessageHub } from "~/libs/hooks/use-message-hub";

export function MapBox() {
  // Important to "freeze" the connection value between re-renders https://legacy.reactjs.org/docs/hooks-reference.html#lazy-initial-state
  const [connection] = useState<HubConnection>(() => createConnection("https://localhost:7108/stream/v1/geohub"));
  const { geoInfo } = useMessageHub(connection);
  const [count, setCount] = useState(0);

  return <div>
    <div>
      <span>ConnectionId: {connection?.connectionId}</span>
    </div>
    <p>Count: {count}</p>
    <pre style={{ textAlign: "left" }}>{JSON.stringify(geoInfo, null, 2)}</pre>
    <button onClick={() => setCount(count + 1) }>Increment</button>
  </div>
}