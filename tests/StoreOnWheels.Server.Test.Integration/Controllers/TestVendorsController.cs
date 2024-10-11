using Microsoft.AspNetCore.Mvc.Testing;
using Newtonsoft.Json;
using StoreOnWheels.Server.Libs.Shared.Models;
using System.Net;
using System.Net.Http.Json;
using Xunit.Abstractions;

namespace StoreOnWheels.Server.Test.Integration.Controllers;

public class TestVendorsController(
	CustomWebAppFactory<Program> factory,
	ITestOutputHelper Logger
	) : IClassFixture<CustomWebAppFactory<Program>> {
	private readonly HttpClient _client = factory.CreateClient(new WebApplicationFactoryClientOptions {
		AllowAutoRedirect = false
	});

	[Fact]
	public async Task Post_CreateVendor_ReturnsCreated() {
		Vendor vendor = new() { Id = "123", DisplayName = "Mock_Vendor" };
		const string uri = "/api/v1/vendors";
		HttpResponseMessage response = await _client.PostAsJsonAsync(uri, vendor);
		string content = await response.Content.ReadAsStringAsync();
		Logger.WriteLine(content);

		Assert.Equal(HttpStatusCode.Created, response.StatusCode);

		var result = JsonConvert.DeserializeObject<Vendor>(content);

		Assert.NotNull(result);
		Assert.Equal(vendor.DisplayName, result.DisplayName);
	}
}