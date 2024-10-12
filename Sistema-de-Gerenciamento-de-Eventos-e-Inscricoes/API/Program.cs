using API.Models;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Hosting;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddDbContext<AppDbContex>();
var app = builder.Build();

app.MapGet("/", () => "Hello, Minimal API!");

app.MapPost("/sistema/register", ([FromBody] Usuario usuario, [FromServices] AppDbContex ctx) => {

    ctx.Add(usuario);
    ctx.SaveChanges();
    return Results.Created("", usuario);

});

app.MapDelete("/sistema/delete/{id}", (int id, [FromServices] AppDbContex ctx) => {

    Usuario? usuario = ctx.Usuarios.Find(id);
    if (usuario == null)
        return Results.NotFound();
    
    ctx.Remove(usuario);
    ctx.SaveChanges();
    return Results.Ok("Usuário deletado com sucesso!");

});

app.Run();