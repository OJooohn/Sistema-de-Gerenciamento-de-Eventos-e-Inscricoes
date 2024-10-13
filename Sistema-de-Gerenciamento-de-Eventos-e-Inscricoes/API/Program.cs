using API.Enums;
using API.Models;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Hosting;

// Use estes comandos para resetar o auto incrementos das tabelas
// UPDATE sqlite_sequence SET seq = 0 WHERE name = 'Usuarios';
// UPDATE sqlite_sequence SET seq = 0 WHERE name = 'Eventos';

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

// Atualizar Usuário
app.MapPut("/sistema/atualizar_cadastro/{id}", (int id, [FromBody] Usuario cadastroAtualizado, [FromServices] AppDbContex ctx) => {

    Usuario? usuario = ctx.Usuarios.Find(id);
    if (usuario == null)
        return Results.NotFound();

    usuario.Nome = cadastroAtualizado.Nome;
    usuario.Email = cadastroAtualizado.Email;
    usuario.Senha = cadastroAtualizado.Senha;

    ctx.Update(usuario);
    ctx.SaveChanges();
    return Results.Ok("Cadastro atualizado com sucesso!");

});

// Criar Evento
app.MapPost("/sistema/criar_evento", ([FromBody] Evento evento, [FromServices] AppDbContex ctx) => {
    
    if (evento.Proprietario == null || evento.Proprietario.Id == 0)
        return Results.BadRequest("Proprietário não informado.");
    
    Usuario? usuario = ctx.Usuarios.Find(evento.Proprietario.Id);

    if (usuario == null)
        return Results.NotFound("Usuário não encontrado.");
    
    evento.Proprietario = usuario;

    if (usuario.Perfil != PerfilEnum.Organizador)
        return Results.BadRequest("Usuário não é um organizador.");

    ctx.Add(evento);
    ctx.SaveChanges();
    return Results.Created("", evento);

});

// Deletar Evento
app.MapDelete("/sistema/deletar_evento/{id}", (int id, [FromServices] AppDbContex ctx) => {

    Evento? evento = ctx.Eventos.Find(id);

    if (evento == null)
        return Results.NotFound();

    ctx.Remove(evento);
    ctx.SaveChanges();
    return Results.Ok("Evento deletado com sucesso!");

});

// Listar Eventos
app.MapGet("/sistema/listar_eventos", ([FromServices] AppDbContex ctx) => {

    if(ctx.Eventos.Any())
        return Results.Ok(ctx.Eventos.ToList());
    return Results.NotFound("Nenhum evento encontrado.");

});

app.Run();