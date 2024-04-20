namespace StoreOnWheels.Server.Controllers;

public interface IGeoHubClient {
	Task ReceiveMessage(string user, string message);
}
