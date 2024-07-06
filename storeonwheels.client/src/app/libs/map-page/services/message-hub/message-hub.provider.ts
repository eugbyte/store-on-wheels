import { InjectionToken } from "@angular/core";
import * as signalR from "@microsoft/signalr";
import { HubConnection } from "@microsoft/signalr";

function createConnection(url: string): HubConnection {
  return new signalR.HubConnectionBuilder()
    .withUrl(url)
    .configureLogging(signalR.LogLevel.Information)
    .withAutomaticReconnect() // https://tinyurl.com/eh7bfrjp
    .build();
}

export const hubConnection = createConnection("stream/v1/geohub");
export const HUB_CONNECTION = new InjectionToken<string>("HUB_CONNECTION");
