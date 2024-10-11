namespace StoreOnWheels.Server.Domains.Interfaces;

public interface IGeoHubClient {
	Task MessageReceived(string userId, string message);
}