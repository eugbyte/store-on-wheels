namespace StoreOnWheels.Server.Controllers;

public interface IGeoHubClient {
	Task MessageReceived(string user, string message);
}
