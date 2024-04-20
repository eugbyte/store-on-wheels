using Newtonsoft.Json;

namespace StoreOnWheels.Server.Models;

public class GeolocationPosition {
	public string VendorId { get; set; } = "";
	public Vendor Vendor { get; set; } = new() { Id = "", DisplayName = "" };
	public GeolocationCoordinate Coords { get; set; } = new();
	public long Timestamp { get; set; }

	public override string ToString() {
		return JsonConvert.SerializeObject(this);
	}
}
