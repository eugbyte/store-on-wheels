namespace StoreOnWheels.Server.Libs.Domains.Interfaces;

public interface IGeoHubClient {
	Task MessageReceived(string userId, string message);
}