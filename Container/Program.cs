var builder = WebApplication.CreateBuilder(args);

var app = builder.Build();

app.MapGet("/hello", () =>
{
    return "World " + Random.Shared.Next(100);
});

app.Run();

// Browse to http://localhost:5093/hello