using Microsoft.EntityFrameworkCore;

namespace StoreOnWheels.Server.Libs.Shared.Configs;

public static partial class ServiceCollectionExtension {
	public static void CreateSqliteDbFile<T>(this WebApplication app) where T : DbContext {
		using var scope = app.Services.CreateScope();
		var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
		context.Database.Migrate();
	}
}