using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace StoreOnWheels.Server.Libs.Domains.Models;

public class GeolocationPosition {
	public string VendorId { get; set; } = "";
	public Vendor Vendor { get; set; } = new() { Id = "", DisplayName = "" };
	public GeolocationCoordinate Coords { get; set; } = new();
	public long Timestamp { get; set; }

	public string ToJson() {
		return JsonConvert.SerializeObject(this, new JsonSerializerSettings { ContractResolver = new CamelCasePropertyNamesContractResolver() });
	}
}