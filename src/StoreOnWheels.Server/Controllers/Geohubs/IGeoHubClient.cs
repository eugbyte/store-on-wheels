namespace StoreOnWheels.Server.Controllers.Geohubs;

public interface IGeoHubClient {
	Task MessageReceived(string userId, string message);
}