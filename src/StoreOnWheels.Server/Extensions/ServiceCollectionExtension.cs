using Microsoft.EntityFrameworkCore;
using StoreOnWheels.Server.Data;

namespace StoreOnWheels.Server.Extensions;
/// <summary>
/// Deprecated. Sql migration to run in a separate script in CI/CD pipeline.
/// </summary>
public static partial class ServiceCollectionExtension {
	public static void CreateSqliteDbFile<T>(this WebApplication app) where T : DbContext {
		using var scope = app.Services.CreateScope();
		var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
		context.Database.Migrate();
	}
}