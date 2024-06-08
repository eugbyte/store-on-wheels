using StoreOnWheels.Server.Libs.Shared.Models;

namespace StoreOnWheels.Server.Libs.Vendors;

public interface IVendorService {
	Task<Vendor?> Get(string vendorId);
	Task<Vendor?> GetByName(string displayName);
	Task<Vendor> Create(Vendor vendor);
	Task Delete(string vendorId);
}
