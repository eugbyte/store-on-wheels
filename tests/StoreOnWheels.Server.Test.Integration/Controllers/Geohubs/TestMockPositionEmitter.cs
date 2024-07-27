using Microsoft.AspNetCore.SignalR.Client;
using Microsoft.AspNetCore.TestHost;
using Xunit.Abstractions;

namespace StoreOnWheels.Server.Test.Integration.Controllers.Geohubs;

public class TestMockPositionEmitter : IClassFixture<CustomWebAppFactory<Program>> {
	private record MessageInfo(string User, string Message);
	private readonly CustomWebAppFactory<Program> factory;
	private readonly ITestOutputHelper Logger;
	private readonly string _wsUrl;

	public TestMockPositionEmitter(
	CustomWebAppFactory<Program> _factory,
	ITestOutputHelper logger
	) {
		factory = _factory;
		Logger = logger;

		HttpClient client = _factory.CreateDefaultClient();
		string baseAddress = (client.BaseAddress?.ToString() ?? "")
			.TrimEnd('/');
		_wsUrl = $"{baseAddress}/stream/v1/geohub";
		Logger.WriteLine(_wsUrl);
	}

	[Fact]
	public async Task Mock_Vendor_Info_On_Connected() {
		HubConnection connection = Connection();
		await connection.StartAsync();

		Logger.WriteLine("Connection started successfully");
		(string vendorId, string message) = await GetMessageInfoAsync(connection);
		Assert.NotEmpty(vendorId);
		Assert.NotEmpty(message);
	}

	private HubConnection Connection() {
		// Arrange
		TestServer server = factory.Server;

		return new HubConnectionBuilder()
				.WithUrl(_wsUrl, (option) => {
					// TestServer requires HubConnectionBuilder to use the HttpMessageHandler created by it in order to be able to call the Hub(s).
					// https://tinyurl.com/3fdet66t
					option.HttpMessageHandlerFactory = (_) => server.CreateHandler();
				})
				.Build();
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
