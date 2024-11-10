using StoreOnWheels.Server.Domains.Models;

namespace StoreOnWheels.Server.Domains.Interfaces;

public interface IVendorService {
	Task<Vendor?> Get(string vendorId);
	Task<Vendor?> GetByName(string displayName);
	Task<Vendor> Create(Vendor vendor);
	Task Delete(string vendorId);
}