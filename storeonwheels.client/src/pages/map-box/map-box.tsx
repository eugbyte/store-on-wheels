import { useState } from "react";
import { HubConnection } from "@microsoft/signalr";
import { createConnection, useMessageHub } from "~/libs/hooks/use-message-hub";

export function MapBox() {
  const [connection] = useState<HubConnection>(createConnection("https://localhost:7108/stream/v1/geohub"));
  const { geoInfo } = useMessageHub(connection);

  return <div>
    <div>
      <span>ConnectionId: {connection?.connectionId}</span>
    </div>
    <pre style={{textAlign: "left"} }>{JSON.stringify(geoInfo, null, 2)}</pre>
  </div>
}