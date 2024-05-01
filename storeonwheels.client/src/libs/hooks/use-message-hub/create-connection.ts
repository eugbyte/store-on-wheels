import * as signalR from "@microsoft/signalr";
import { HubConnection } from "@microsoft/signalr";

export function createConnection(url: string): HubConnection {
  return new signalR.HubConnectionBuilder()
    .withUrl(url)
    .configureLogging(signalR.LogLevel.Information)
    .withAutomaticReconnect() // https://learn.microsoft.com/en-us/aspnet/core/signalr/javascript-client?view=aspnetcore-8.0&tabs=visual-studio-code#automatically-reconnect/
    .build();
}
