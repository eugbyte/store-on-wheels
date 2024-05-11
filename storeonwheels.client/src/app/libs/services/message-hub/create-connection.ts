import * as signalR from "@microsoft/signalr";
import { HubConnection } from "@microsoft/signalr";
import { Injectable, InjectionToken } from '@angular/core';

export function createConnection(url: string): HubConnection {
  return new signalR.HubConnectionBuilder()
    .withUrl(url)
    .configureLogging(signalR.LogLevel.Information)
    .withAutomaticReconnect() // https://tinyurl.com/eh7bfrjp
    .build();
}

export const HUB_CONNECTION_TOKEN = new InjectionToken<string>("hub.connection");
export const hubConnection = createConnection("https://localhost:7108/stream/v1/geohub");
