using Microsoft.AspNetCore.SignalR.Client;

namespace StoreOnWheels.Server.Test.Integration.Controllers.Geohubs;

public class TestMockPositionEmitter : IClassFixture<CustomWebAppFactory<Program>> {
	private record MessageInfo(string User, string Message);
	private static readonly string _wsUrl = "/stream/v1/geohub";
	private readonly HubConnection _connection = new HubConnectionBuilder()
			.WithUrl(_wsUrl)
			.Build();

	[Fact]
	public async Task Mock_Vendor_Info_On_Connected() {
		await _connection.StartAsync();
		(string vendorId, string message) = await GetMessageInfoAsync(_connection);
		Assert.NotEmpty(vendorId);
		Assert.NotEmpty(message);
	}

	private Task<MessageInfo> GetMessageInfoAsync(HubConnection connection) {
		TaskCompletionSource<MessageInfo> infoTcs = new();

		connection.On<string, string>("MessageReceived", (vendorId, msg) => {
			MessageInfo info = new(vendorId, msg);
			infoTcs.SetResult(info);
			connection.Remove("MessageReceived");
		});

		return infoTcs.Task;
	}
}
