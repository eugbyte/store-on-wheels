using Microsoft.AspNetCore.Mvc.Testing;
using Newtonsoft.Json;
using StoreOnWheels.Server.Libs.Shared.Models;
using System.Net;
using System.Net.Http.Json;

namespace StoreOnWheels.Server.Test.Controllers.Vendors;

public class TestVendorsController(CustomWebAppFactory<Program> factory) : IClassFixture<CustomWebAppFactory<Program>> {
	private readonly HttpClient _client = factory.CreateClient(new WebApplicationFactoryClientOptions {
		AllowAutoRedirect = false
	});

	[Fact]
	public async Task Post_CreateVendor_ReturnsOk() {
		Vendor vendor = new() { Id = "", DisplayName = "Mock_Vendor" };
		const string uri = "/api/v1/vendors";
		HttpResponseMessage response = await _client.PostAsJsonAsync(uri, vendor);
		Assert.Equal(HttpStatusCode.Created, response.StatusCode);

		string content = await response.Content.ReadAsStringAsync();
		var result = JsonConvert.DeserializeObject<Vendor>(content);

		Assert.NotNull(result);
		Assert.Equal(vendor.DisplayName, result.DisplayName);
	}
}
