import { useEffect, useState } from "react";
import { GeoInfo } from "~/libs/models";
import { getRandomNum } from "~/libs/random";
import { HubConnection, HubConnectionState } from "@microsoft/signalr";

export interface IMessageHubResult {
  geoInfo?: GeoInfo;
}

export function useMessageHub(connection: HubConnection): IMessageHubResult {
  const [geoInfo, setGeoInfo] = useState<GeoInfo>();

  useEffect(() => {
    if (connection == null) {
      return;
    }
    connection.on("MessageReceived", ((_user: string, message: string) => {
      console.log("message received ");
      const info: GeoInfo = JSON.parse(message);
      setGeoInfo(info);
    }));

  }, [connection]);

  useEffect(() => {
    (async () => {
      if (connection == null || connection.state != HubConnectionState.Disconnected) {
        return;
      }

      try {
        await connection.start();
        const connId = connection.connectionId as string;
        console.log({ connId });
      } catch (error) {
        console.error(error);
      }
    })();
  }, [connection]);

  useEffect(() => {
    const id = setInterval(() => {
      if (connection == null || connection.state != HubConnectionState.Connected) {
        return;
      }
      const info = new GeoInfo();
      info.vendorId = connection.connectionId ?? "";
      info.coords.latitude = getRandomNum(1, 11);
      info.coords.latitude = getRandomNum(1, 11);

      console.log("sending message");
      connection.send("broadcastMessageWithoutAuth", "random_user", JSON.stringify(info));
    }, 5000);

    return () => clearInterval(id);
  }, [connection]);

  return { geoInfo };
}
