using Microsoft.AspNetCore.SignalR.Client;
using Newtonsoft.Json;
using StoreOnWheels.Server.Libs.Domains.Models;
using Xunit.Abstractions;

namespace StoreOnWheels.Server.Test.Integration.Controllers;

public class TestGeohubClient(
	CustomWebAppFactory<Program> factory,
	ITestOutputHelper Logger
	) : IClassFixture<CustomWebAppFactory<Program>>, IAsyncLifetime {
	private record MessageInfo(string User, string Message);
	private HubConnection connection = factory.HubConnection();

	public async Task InitializeAsync() {
		connection = factory.HubConnection();
		await connection.StartAsync();
	}

	public async Task DisposeAsync() {
		await connection.DisposeAsync();
	}

	[Fact]
	public async Task Broadcast_Vendor_Position_Annonymously_Should_Broadcast_Position() {
		GeolocationPosition geoInfo = new() {
			VendorId = connection.ConnectionId ?? "",
			Vendor = {
				Id = connection.ConnectionId ?? "",
				DisplayName = "",
			}
		};
		string str = JsonConvert.SerializeObject(geoInfo);
		Exception? error = null;
		try {
			await connection.SendAsync("BroadcastVendorPositionAnonymously", "vendor1", str);
		} catch (Exception ex) {
			Logger.WriteLine(ex.Message);
			error = ex;
		}
		Assert.Null(error);
	}
}