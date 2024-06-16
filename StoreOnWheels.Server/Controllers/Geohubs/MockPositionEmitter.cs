using Microsoft.AspNetCore.SignalR;
using StoreOnWheels.Server.Libs.Shared.Models;

namespace StoreOnWheels.Server.Controllers.Geohubs;

public class MockPositionEmitter(
	IHubContext<GeohubsClient> hubContext) : BackgroundService {
	private readonly Random rnd = new();

	protected override async Task ExecuteAsync(CancellationToken stoppingToken) {
		PeriodicTimer timer = new(TimeSpan.FromSeconds(5));
		while (await timer.WaitForNextTickAsync(stoppingToken)) {
			for (int i = 1; i <= 10; i++) {
				GeolocationPosition info = MockPosition(i);
				await hubContext.Clients.All.SendAsync("MessageReceived", info.VendorId, info.ToJson(), stoppingToken);
			};
		}
	}

	private GeolocationPosition MockPosition(int index) {
		string vendorId = $"vendor_{index}";

		return new() {
			VendorId = vendorId,
			Coords = new GeolocationCoordinate() {
				Latitude = (float)(1.3 + rnd.Next(1, 50) / 5000),
				Longitude = (float)(103.8 + rnd.Next(1, 50) / 5000),
				Heading = rnd.Next(0, 360)
			},
			Timestamp = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds(),
			Vendor = new Vendor() {
				Id = vendorId,
				DisplayName = $"Vendor {index}",
				Description = $"Random Vendor {index}",
			}
		};
	}
}

