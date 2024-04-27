using Caching;
using Microsoft.AspNetCore.SignalR;
using Newtonsoft.Json;
using StoreOnWheels.Server.Models;
using StoreOnWheels.Server.Services;

namespace StoreOnWheels.Server.Controllers;

public class GeoHub(
	ILogger<GeoHub> Logger,
	LRUCache<string, Vendor> vendorCache,
	IVendorService vendorService) : Hub<IGeoHubClient> {

	// Allow user to broadcast message without first authenticating
	// js client calls "BroadcastMessageWithoutAuth()"
	// SignalR hub broadcast message to all ws clients with the event name of "ReceiveMessage"
	public async Task BroadcastMessageWithoutAuth(string user, string message) {
		GeolocationPosition? geoposition = JsonConvert.DeserializeObject<GeolocationPosition>(message);
		if (geoposition is null) {
			return;
		}

		string anonymousVendorId = Context.ConnectionId;

		// replace the vendor information sent by the client. Disallow users from modifying the profile.
		if (!vendorCache.Contains(anonymousVendorId)) {
			Vendor? vendor = await vendorService.Get(anonymousVendorId);
			if (vendor is not null) {
				vendorCache.AddReplace(anonymousVendorId, vendor);
			}
		}

		geoposition.Vendor = vendorCache.Get(anonymousVendorId);

		message = JsonConvert.SerializeObject(geoposition);
		await Clients.All.MessageReceived(user, message);
	}

	public override async Task OnConnectedAsync() {
		Logger.LogInformation("connected to {}", Context.ConnectionId);
		await base.OnConnectedAsync();
	}

	public override async Task OnDisconnectedAsync(Exception? exception) {
		// in the event the connection is annonymous, immediately free the information
		string anonymousVendorId = Context.ConnectionId;
		try {
			vendorCache.Remove(anonymousVendorId);
			await vendorService.Delete(anonymousVendorId);
		} catch (Exception) {
			// Most likely, the user was not annonymous
			// let the LRU cache remove the user naturally when the cache size is hit
		}

		await base.OnDisconnectedAsync(exception);
	}
}
