var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

var app = builder.Build();

app.MapGet("/hello", () =>
{
    return "World " + Random.Shared.Next(100);
});

app.Run();