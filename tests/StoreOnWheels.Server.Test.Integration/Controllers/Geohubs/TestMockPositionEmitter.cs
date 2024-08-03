using Microsoft.AspNetCore.SignalR.Client;
using Xunit.Abstractions;

namespace StoreOnWheels.Server.Test.Integration.Controllers.Geohubs;

public class TestMockPositionEmitter(
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
	public async Task Mock_Vendor_Info_On_Connected() {
		Logger.WriteLine("Connection started successfully");
		(string vendorId, string message) = await GetMessageInfoAsync(connection);
		Assert.NotEmpty(vendorId);
		Assert.NotEmpty(message);

		await connection.DisposeAsync();
	}

	private static Task<MessageInfo> GetMessageInfoAsync(HubConnection connection) {
		TaskCompletionSource<MessageInfo> infoTcs = new();

		connection.On<string, string>("MessageReceived", (vendorId, msg) => {
			MessageInfo info = new(vendorId, msg);
			infoTcs.SetResult(info);
			connection.Remove("MessageReceived");   // free memory
		});
		return infoTcs.Task;
	}
}