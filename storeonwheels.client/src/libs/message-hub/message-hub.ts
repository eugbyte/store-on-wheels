import * as signalR from "@microsoft/signalr";
import { HttpTransportType } from "@microsoft/signalr";

export type Callback = (user: string, message: string) => void;

export function createConnection(url: string) {
  return new signalR.HubConnectionBuilder()
    .withUrl(url, {
      skipNegotiation: true,
      transport: HttpTransportType.WebSockets,
    })
    .configureLogging(signalR.LogLevel.Information)
    .build();
}