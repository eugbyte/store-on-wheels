using Microsoft.AspNetCore.SignalR;
using StoreOnWheels.Server.Libs.Shared.Models;

namespace StoreOnWheels.Server.Controllers.Geohubs;

public class MockPositionEmitter(
	ILogger<MockPositionEmitter> Logger,
	IHubContext<GeohubsClient> hubContext) : BackgroundService {
	protected override async Task ExecuteAsync(CancellationToken stoppingToken) {
		PeriodicTimer timer = new(TimeSpan.FromSeconds(5));
		while (await timer.WaitForNextTickAsync(stoppingToken)) {
			Logger.LogInformation("Ticked");
			for (int i = 1; i <= 2; i++) {
				GeolocationPosition info = MockPosition(i);
				await hubContext.Clients.All.SendAsync("MessageReceived", info.VendorId, info.ToJson(), stoppingToken);
			};
		}
	}

	private GeolocationPosition MockPosition(int index) {
		int i = index;
		Random rnd = new();
		string vendorId = $"vendor{i}";

		return new() {
			VendorId = vendorId,
			Coords = new GeolocationCoordinate() {
				Latitude = (float)(1.3 + rnd.Next(1, 9) / 1000),
				Longitude = (float)(103.8 + rnd.Next(1, 9) / 1000),
				Heading = rnd.Next(0, 360)
			},
			Timestamp = DateTimeOffset.UtcNow.ToUnixTimeSeconds(),
			Vendor = new Vendor() {
				Id = vendorId,
				DisplayName = $"Vendor {i}",
				Description = "Random Vendor",
			}
		};
	}
}

