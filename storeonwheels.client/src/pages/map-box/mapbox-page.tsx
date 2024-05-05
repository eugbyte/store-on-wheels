import { MapBox } from "~/components/mapbox";
import { createConnection } from "~/libs/hooks/use-message-hub";
import { useState } from "react";
import { HubConnection } from "@microsoft/signalr";

export function MapBoxPage() {
  // Important to "freeze" the connection value between re-renders https://legacy.reactjs.org/docs/hooks-reference.html#lazy-initial-state
  const [connection] = useState<HubConnection>(() =>
    createConnection("https://localhost:7108/stream/v1/geohub")
  );
  return (
    <div>
      <MapBox connection={connection} />
    </div>
  );
}
