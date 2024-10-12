using Microsoft.AspNetCore.SignalR;
using StoreOnWheels.Server.Controllers;
using StoreOnWheels.Server.Libs.Domains.Models;

namespace StoreOnWheels.Server.Libs.Services.BackgroundServices;

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

		return new GeolocationPosition() {
			VendorId = vendorId,
			Coords = new GeolocationCoordinate() {
				Latitude = (float)(1.3 + rnd.Next(1, 100) / 1000.0),    // 1000.0 => Needs to be float
				Longitude = (float)(103.8 + rnd.Next(1, 100) / 1000.0), // 1000.0 => Needs to be float
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