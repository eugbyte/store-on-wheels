using Caching;
using Microsoft.EntityFrameworkCore;
using StoreOnWheels.Server.Controllers;
using StoreOnWheels.Server.Data;
using StoreOnWheels.Server.Domains.Interfaces;
using StoreOnWheels.Server.Domains.Models;
using StoreOnWheels.Server.Services;
using StoreOnWheels.Server.Services.BackgroundServices;

var builder = WebApplication.CreateBuilder(args);
builder.Configuration.AddEnvironmentVariables();

// register DB
string? dbConnStr = builder.Configuration.GetConnectionString("WebApiDatabase");
builder.Services.AddDbContext<AppDbContext>((options) => options.UseSqlite(dbConnStr));

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
app.UseHttpsRedirection();

// UseCors must be called before MapHub.
// The call to UseCors must be placed after UseRouting, but before UseAuthorization
// https://learn.microsoft.com/en-us/aspnet/core/security/cors?view=aspnetcore-8.0
app.UseCors();

app.UseAuthorization();
app.MapControllers();

// UseCors must be called before MapHub.
app.UseCors();
app.MapHub<GeohubsClient>("/stream/v1/geohub");

app.MapFallbackToFile("/index.html");

app.Run();

// needed for integration test (https://tinyurl.com/yc2p5674)
public partial class Program { }