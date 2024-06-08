using Microsoft.AspNetCore.Mvc;

namespace StoreOnWheels.Server.Controllers.Heartbeats;

[Route("api/v1/[controller]")]
[ApiController]
public class HeartbeatsController : ControllerBase {
	[HttpGet(Name = "Heartbeat")]
	public ActionResult Get() {
		var payload = new { Message = "Server is up and running" };
		return Ok(payload);
	}
}
