using Microsoft.EntityFrameworkCore;

using WebAPI.Data;
using WebAPI.Repositories;
using WebAPI.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddControllers();
builder.Services.AddOpenApi();

// Add CORS policy - Uncomment once I need to enable CORS, but configure it to be more secure
// builder.Services.AddCors(options =>
// {
//     options.AddPolicy("AllowSpecificOrigin",
//         builder => builder.WithOrigins("*") // Allow all origins
//                         .AllowAnyHeader()
//                         .AllowAnyMethod());
// });

// Configure services for dependency injection
builder.Services.AddScoped<IAppsRepository, AppsRepository>();
builder.Services.AddScoped<IAppsService, AppsService>();

// Configure PostgreSQL connection
builder.Services.AddDbContext<Context>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// Configure the app
var app = builder.Build();
// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}
app.UseHttpsRedirection();
app.UseRouting();
// Use the CORS policy
//app.UseCors("AllowSpecificOrigin");
app.UseAuthorization();
app.MapControllers();

app.Run();
