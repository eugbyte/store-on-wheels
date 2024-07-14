using Caching;
using Microsoft.AspNetCore.SignalR;
using Newtonsoft.Json;
using StoreOnWheels.Server.Libs.Shared.Models;
using StoreOnWheels.Server.Libs.Vendors;

namespace StoreOnWheels.Server.Controllers.Geohubs;

public class GeohubsClient(
	ILogger<GeohubsClient> Logger,
	LRUCache<string, Vendor> vendorCache,
	IVendorService vendorService) : Hub<IGeoHubClient> {
	private string _vendorId = "";
	// Allow user to broadcast message without first authenticating
	// js client calls "BroadcastVendorPositionAnonymously()"
	// SignalR hub broadcast message to all ws clients with the event name of "ReceiveMessage"
	public async Task BroadcastVendorPositionAnonymously(string vendorId, string message) {
		// for annonymous broadcast, the vendor id is set to the connection id
		if (vendorId != Context.ConnectionId) {
			throw new Exception("For annonymous broadcast, vendor id is set to ws connection id");
		}

		GeolocationPosition? geoposition = JsonConvert.DeserializeObject<GeolocationPosition>(message);
		if (geoposition is null) {
			Logger.LogInformation("geoposition is null for {vendorId}", vendorId);
			return;
		}

		// replace the vendor information sent by the client. Disallow users from modifying the profile.
		if (!vendorCache.Contains(vendorId)) {
			// To Do: Throw Exception if vendor not found
			Vendor vendor = await vendorService.Get(vendorId)
				?? throw new Exception("vendor not found");
			vendorCache.AddReplace(vendorId, vendor);
		}

		geoposition.Vendor = vendorCache.Get(vendorId);
		geoposition.VendorId = vendorId;
		await Clients.All.MessageReceived(vendorId, geoposition.ToJson());
	}

	public override async Task OnConnectedAsync() {
		Logger.LogInformation("connected to {}", Context.ConnectionId);
		await base.OnConnectedAsync();
	}

	public override async Task OnDisconnectedAsync(Exception? exception) {
		Logger.LogInformation("Disconnected from {}", Context.ConnectionId);

		// in the event the connection is annonymous, immediately free the information		
		try {
			string anonymousVendorId = Context.ConnectionId;
			vendorCache.Remove(anonymousVendorId);
			await vendorService.Delete(anonymousVendorId);
		} catch (Exception) {
			// Most likely, the user was not annonymous
			// let the LRU cache remove the user naturally when the cache size is hit
		}

		await base.OnDisconnectedAsync(exception);
	}
}
