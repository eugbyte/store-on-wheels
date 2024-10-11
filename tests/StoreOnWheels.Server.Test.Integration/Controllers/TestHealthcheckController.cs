using Microsoft.AspNetCore.Mvc.Testing;
using Newtonsoft.Json;
using System.Net;

namespace StoreOnWheels.Server.Test.Integration.Controllers;

public class TestHealthcheckController(
	WebApplicationFactory<Program> factory) : IClassFixture<WebApplicationFactory<Program>> {
	private readonly HttpClient client = factory.CreateClient();

	[Fact]
	public async Task TestGet() {
		const string url = "api/v1/healthchecks";
		HttpResponseMessage response = await client.GetAsync(url);

		string content = await response.Content.ReadAsStringAsync();
		var result = JsonConvert.DeserializeObject<Dictionary<string, string>>(content);

		Assert.Equal(HttpStatusCode.OK, response.StatusCode);
		Assert.NotNull(result);
		Assert.Equal("Server is up and running", result["message"]);
	}
}