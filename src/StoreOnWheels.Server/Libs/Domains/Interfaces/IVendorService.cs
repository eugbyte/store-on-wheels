using StoreOnWheels.Server.Libs.Domains.Models;

namespace StoreOnWheels.Server.Libs.Domains.Interfaces;

public interface IVendorService {
	Task<Vendor?> Get(string vendorId);
	Task<Vendor?> GetByName(string displayName);
	Task<Vendor> Create(Vendor vendor);
	Task Delete(string vendorId);
}