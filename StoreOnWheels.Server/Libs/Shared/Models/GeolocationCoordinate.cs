namespace StoreOnWheels.Server.Libs.Shared.Models;

public class GeolocationCoordinate {
	public float Latitude { get; set; }
	public float Longitude { get; set; }
	public float Heading { get; set; }
	public float Speed { get; set; }
	public float Accuracy { get; set; }
	public float Altitude { get; set; }
	public float AltitudeAccuracy { get; set; }

	public void Deconstruct(
		out float latitude,
		out float longitude,
		out float heading,
		out float speed,
		out float altitude,
		out float accuracy,
		out float altitudeAccuracy) {
		latitude = Latitude;
		longitude = Longitude;
		heading = Heading;
		speed = Speed;
		accuracy = Accuracy;
		altitude = Altitude;
		altitudeAccuracy = AltitudeAccuracy;
	}
}
