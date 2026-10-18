using Microsoft.AspNetCore.Server.Kestrel.Core;
using MyApp.Database;

var builder = WebApplication.CreateBuilder(args);

// إنشاء قاعدة البيانات إذا لم تكن موجودة
DatabaseInitializer.Initialize();

// Kestrel
builder.WebHost.ConfigureKestrel(options =>
{
    options.ListenAnyIP(5047);
});

// Services
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI();

app.UseCors("AllowAll");

app.UseAuthorization();

app.MapControllers();

Console.WriteLine("Backend started on port 5047");

app.Run();