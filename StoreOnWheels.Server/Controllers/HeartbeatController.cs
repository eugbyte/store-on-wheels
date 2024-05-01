using Caching;
using Microsoft.AspNetCore.Mvc;

namespace StoreOnWheels.Server.Controllers;

[Route("api/v1/[controller]")]
[ApiController]
public class HeartbeatController(LRUCache<int, int> cache) : ControllerBase {
	[HttpGet(Name = "Heartbeat")]
	public ActionResult Get() {
		var payload = new { Message = "Server is up and running" };
		return Ok(payload);
	}

	[HttpGet("add/{num}")]
	public ActionResult AddNum(int num) {
		cache.AddReplace(num, num);
		return Ok();
	}

	[HttpGet("get/{key}")]
	public ActionResult GetNum(int key) {
		int value = cache.Get(key);
		return Ok(new { Value = value });
	}
}
