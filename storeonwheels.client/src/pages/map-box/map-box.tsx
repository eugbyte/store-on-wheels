import { HubConnection, HubConnectionState } from "@microsoft/signalr";
import { useEffect, useState } from "react";
import { createConnection } from "~/libs/message-hub";
import { GeoInfo } from "~/libs/models";
import { getRandomNum } from "~/libs/random";

export function MapBox() {
  const [connection] = useState<HubConnection>(createConnection("https://localhost:7108/stream/v1/geohub"));
  const [geoInfo, setGeoInfo] = useState<GeoInfo>();

  useEffect(() => {
    (async () => {
      if (connection == null || connection.state != HubConnectionState.Disconnected) {
        return;
      }
      try {
        await connection.start();
      } catch (error) {
        console.error(error);
      }
    })();    
  }, [connection]);

  useEffect(() => {
    if (connection == null || connection.state != HubConnectionState.Connected) {
      return;
    }
    connection.on("messageReceived", ((_user: string, message: string) => {
      const info: GeoInfo = JSON.parse(message);
      setGeoInfo(info);
    }));    
  }, [connection]);

  useEffect(() => {
    const id = setInterval(() => {
      console.log({ state: connection?.state });
      if (connection == null || connection.state != HubConnectionState.Connected) {
        return;
      }
      const info = new GeoInfo();
      info.vendorId = connection.connectionId ?? "";
      info.coords.latitude = getRandomNum(1, 11);
      info.coords.latitude = getRandomNum(1, 11);
      console.log("sending message");
      connection.send("broadcastMessageWithoutAuth", "random_user", JSON.stringify(info));
    }, 2000);

    return () => clearInterval(id);
  }, [connection]);

  return <div>
    <pre>{JSON.stringify(geoInfo, null, 2)}</pre>
  </div>
}