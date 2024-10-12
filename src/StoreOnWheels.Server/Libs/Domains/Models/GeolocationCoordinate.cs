namespace StoreOnWheels.Server.Libs.Domains.Models;

public class GeolocationCoordinate {
	public float Latitude { get; set; }
	public float Longitude { get; set; }
	public float Heading { get; set; }
	public float Speed { get; set; }
	public float Accuracy { get; set; }
	public float Altitude { get; set; }
	public float AltitudeAccuracy { get; set; }
}