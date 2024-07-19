using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace StoreOnWheels.Server.Libs.Shared.Models;

[Index(nameof(DisplayName), IsUnique = true)]
public class Vendor {
	[Key]
	public required string Id { get; set; }
	public required string DisplayName { get; set; }
	public string Description { get; set; } = string.Empty;

	public void Deconstruct(
		out string id,
		out string displayName,
		out string description) {
		id = Id;
		displayName = DisplayName;
		description = Description;
	}
}