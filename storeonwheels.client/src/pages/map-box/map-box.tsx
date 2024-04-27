import { HubConnection } from "@microsoft/signalr";
import { useEffect, useState } from "react";
import { createConnection } from "~/libs/message-hub";
import { GeoInfo } from "~/libs/models";
import { getRandomNum } from "~/libs/random";

export function MapBox() {
  const [connection] = useState<HubConnection>(createConnection("/stream/v1/geohub"));
  const [geoInfo, setGeoInfo] = useState<GeoInfo>();

  useEffect(() => {
    (async () => {
      await connection.start();
      connection.on("messageReceived", ((_user: string, message: string) => {
        const info: GeoInfo = JSON.parse(message);
        setGeoInfo(info);        
      }));
    })();    
  }, [connection]);

  useEffect(() => {
    setInterval(() => {
      if (connection == null || connection.connectionId == "") {
        return;
      }
      const info = new GeoInfo();
      info.vendorId = connection.connectionId ?? "";
      info.coords.latitude = getRandomNum(1, 11);
      info.coords.latitude = getRandomNum(1, 11);
      connection.send("broadcastMessageWithoutAuth", "random_user", JSON.stringify(info));
    }, 20_000);
  })

  return <div>
    <pre>{JSON.stringify(geoInfo, null, 2)}</pre>
  </div>
}