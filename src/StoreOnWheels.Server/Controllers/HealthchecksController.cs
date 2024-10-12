using Microsoft.AspNetCore.Mvc;

namespace StoreOnWheels.Server.Controllers;

[Route("api/v1/[controller]")]
[ApiController]
public class HealthChecksController : ControllerBase {
	[HttpGet(Name = "Heartbeat")]
	public ActionResult Get() {
		var payload = new { Message = "Server is up and running" };
		return Ok(payload);
	}
}