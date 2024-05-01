import * as signalR from "@microsoft/signalr";
import { HubConnection } from "@microsoft/signalr";

export function createConnection(url: string): HubConnection {
	console.log("creating connection");
	return new signalR.HubConnectionBuilder()
		.withUrl(url)
		.configureLogging(signalR.LogLevel.Information)
		.withAutomaticReconnect() // https://tinyurl.com/eh7bfrjp
		.build();
}
