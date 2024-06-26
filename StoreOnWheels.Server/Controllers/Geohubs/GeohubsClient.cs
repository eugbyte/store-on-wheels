﻿using Caching;
using Microsoft.AspNetCore.SignalR;
using Newtonsoft.Json;
using StoreOnWheels.Server.Libs.Shared.Models;
using StoreOnWheels.Server.Libs.Vendors;

namespace StoreOnWheels.Server.Controllers.Geohubs;

public class GeohubsClient(
	ILogger<GeohubsClient> Logger,
	LRUCache<string, Vendor> vendorCache,
	IVendorService vendorService) : Hub<IGeoHubClient> {
	// Allow user to broadcast message without first authenticating
	// js client calls "BroadcastVendorPosition()"
	// SignalR hub broadcast message to all ws clients with the event name of "ReceiveMessage"
	public async Task BroadcastVendorPosition(string user, string message) {
		GeolocationPosition? geoposition = JsonConvert.DeserializeObject<GeolocationPosition>(message);
		if (geoposition is null) {
			Logger.LogInformation("geoposition is null for {user}", user);
			return;
		}
		Logger.LogInformation(geoposition.ToJson());

		string anonymousVendorId = Context.ConnectionId;

		// replace the vendor information sent by the client. Disallow users from modifying the profile.
		if (!vendorCache.Contains(anonymousVendorId)) {
			// To Do: Throw Exception if vendor not found
			Vendor vendor = await vendorService.Get(anonymousVendorId)
				?? geoposition.Vendor;
			vendorCache.AddReplace(anonymousVendorId, vendor);
		}

		geoposition.Vendor = vendorCache.Get(anonymousVendorId);

		message = geoposition.ToJson();
		await Clients.All.MessageReceived(user, message);
	}

	public override async Task OnConnectedAsync() {
		await base.OnConnectedAsync();
		Logger.LogInformation("connected to {}", Context.ConnectionId);
	}

	public override async Task OnDisconnectedAsync(Exception? exception) {
		Logger.LogInformation("Disconnected from {}", Context.ConnectionId);
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
