using Microsoft.EntityFrameworkCore;
using StoreOnWheels.Server.Data;
using StoreOnWheels.Server.Domains.Interfaces;
using StoreOnWheels.Server.Domains.Models;

namespace StoreOnWheels.Server.Services;

public class VendorService(AppDbContext db) : IVendorService {
	public async Task<Vendor?> Get(string vendorId) => await db.Vendors.FindAsync(vendorId);

	public async Task<Vendor?> GetByName(string displayName) => await db.Vendors.SingleAsync((v) => v.DisplayName == displayName);

	public async Task<Vendor> Create(Vendor vendor) {
		await db.Vendors.AddAsync(vendor);
		await db.SaveChangesAsync();
		return vendor;
	}

	public async Task Delete(string vendorId) {
		Vendor vendor = new() { Id = vendorId, DisplayName = "" };
		db.Vendors.Attach(vendor);
		db.Vendors.Remove(vendor);
		await db.SaveChangesAsync();
	}
}