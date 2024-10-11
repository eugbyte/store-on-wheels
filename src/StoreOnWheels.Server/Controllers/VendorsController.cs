using Caching;
using Microsoft.AspNetCore.Mvc;
using StoreOnWheels.Server.Domains.Interfaces;
using StoreOnWheels.Server.Libs.Shared.Models;

namespace StoreOnWheels.Server.Controllers;

[Route("api/v1/[controller]")]
[ApiController]
public class VendorsController(
	IVendorService vendorService,
	LRUCache<string, Vendor> vendorCache
	) : ControllerBase {

	[HttpGet("{vendorId}")]
	public async Task<ActionResult<Vendor>> Get(string vendorId) {
		Vendor? vendor = await vendorService.Get(vendorId);
		if (vendor is null) {
			return NotFound();
		}
		vendorCache.AddReplace(vendorId, vendor);
		return vendor;
	}

	[HttpPost]
	public async Task<ActionResult<Vendor>> Create([FromBody] Vendor vendor) {
		Vendor createdVendor = await vendorService.Create(vendor);
		return Created("api/v1/vendors", createdVendor);
	}
}