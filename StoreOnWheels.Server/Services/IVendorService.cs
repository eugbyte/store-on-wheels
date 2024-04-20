using StoreOnWheels.Server.Models;

namespace StoreOnWheels.Server.Services;

public interface IVendorService {
	Task<Vendor?> Get(string vendorId);
	Task<Vendor?> GetByName(string displayName);
	Task<Vendor> Create(Vendor vendor);
	Task Delete(string vendorId);
}
