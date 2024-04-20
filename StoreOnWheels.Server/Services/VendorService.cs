using Microsoft.EntityFrameworkCore;
using StoreOnWheels.Server.Configs;
using StoreOnWheels.Server.Models;

namespace StoreOnWheels.Server.Services;

public class VendorService(AppDbContext db) {
	public async Task<Vendor?> Get(string vendorId) => await db.Vendors.FindAsync(vendorId);

	public async Task<Vendor?> GetByName(string displayName) => await db.Vendors.SingleAsync((v) => v.DisplayName == displayName);

	public async Task<Vendor> Create(Vendor vendor) {
		await db.Vendors.AddAsync(vendor);
		await db.SaveChangesAsync();
		return vendor;
	}

	public async Task Delete(string vendorId) {
		db.Vendors.Remove(new Vendor { Id = vendorId, DisplayName = "" });
		await db.SaveChangesAsync();
	}
}
