namespace StoreOnWheels.Server.Controllers.Geohubs;

public interface IGeoHubClient {
	Task MessageReceived(string user, string message);
}
