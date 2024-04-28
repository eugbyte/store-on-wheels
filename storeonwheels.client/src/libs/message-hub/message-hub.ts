import * as signalR from "@microsoft/signalr";

export type Callback = (user: string, message: string) => void;

export function createConnection(url: string) {
  return new signalR.HubConnectionBuilder()
    .withUrl(url)
    .configureLogging(signalR.LogLevel.Information)
    .withAutomaticReconnect()
    .build();
}