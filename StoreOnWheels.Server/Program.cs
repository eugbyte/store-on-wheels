using Caching;
using Microsoft.EntityFrameworkCore;
using StoreOnWheels.Server.Configs;
using StoreOnWheels.Server.Controllers.Geohubs;
using StoreOnWheels.Server.Libs.Shared.Models;
using StoreOnWheels.Server.Libs.Vendors;

var builder = WebApplication.CreateBuilder(args);

// register DB
string? dbConnStr = builder.Configuration.GetConnectionString("WebApiDatabase");
builder.Services.AddDbContext<AppDbContext>(options => options.UseNpgsql(dbConnStr));

// Disable CORs
builder.Services.AddCors(options => {
	options.AddDefaultPolicy(
		builder => {
			builder.WithOrigins("https://localhost:4200")
				.AllowAnyHeader()
				.AllowAnyMethod()
				.AllowCredentials();
		});
});
// Add cache
builder.Services.AddSingleton(new LRUCache<string, Vendor>(capacity: 200, evictCount: 10));
builder.Services.AddSingleton(new LRUCache<int, int>(capacity: 200, evictCount: 10));
builder.Services.AddSingleton(new PeriodicTimer(TimeSpan.FromSeconds(5)));
// Add services to the container.
builder.Services.AddTransient<IVendorService, VendorService>();

builder.Services.AddControllers();
builder.Services.AddSignalR();
// Add Background Worker to periodically send mock data to ws clients
builder.Services.AddHostedService<MockPositionEmitter>();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment()) {
	app.UseSwagger();
	app.UseSwaggerUI();
}

if (app.Environment.IsDevelopment()) {
	app.UseSwagger();
	app.UseSwaggerUI();
};

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

// UseCors must be called before MapHub.
app.UseCors();
app.MapHub<GeohubsClient>("/stream/v1/geohub");

app.MapFallbackToFile("/index.html");

app.Run();
