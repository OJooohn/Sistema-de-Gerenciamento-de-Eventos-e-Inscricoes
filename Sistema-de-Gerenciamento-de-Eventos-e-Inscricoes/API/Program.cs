using API.Enums;
using API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

// Use estes comandos para resetar o auto incrementos das tabelas
// UPDATE sqlite_sequence SET seq = 0 WHERE name = 'Usuarios';
// UPDATE sqlite_sequence SET seq = 0 WHERE name = 'Eventos';
// UPDATE sqlite_sequence SET seq = 0 WHERE name = 'Inscricoes';

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddDbContext<AppDbContex>();
var app = builder.Build();

app.MapGet("/", () => "Sistema de Gerenciamento de Eventos e Inscricoes");

// Registrar Usuário
app.MapPost("/sistema/usuario/registrar", async ([FromBody] Usuario usuario, [FromServices] AppDbContex ctx) => {

    ctx.Usuarios.Add(usuario);
    await ctx.SaveChangesAsync();

    return Results.Created("", usuario);

});

// Deletar Usuário
app.MapDelete("/sistema/usuario/deletar/{id}", async (int id, [FromServices] AppDbContex ctx) => {

    Usuario? usuario = ctx.Usuarios.Find(id);
    if (usuario == null)
        return Results.NotFound();
    
    ctx.Usuarios.Remove(usuario);
    await ctx.SaveChangesAsync();

    return Results.Ok(usuario);

});

// Atualizar Usuário
app.MapPut("/sistema/usuario/atualizar/{id}", async (int id, [FromBody] Usuario cadastroAtualizado, [FromServices] AppDbContex ctx) => {

    Usuario? usuario = ctx.Usuarios.Find(id);
    if (usuario == null)
        return Results.NotFound();

    usuario.Nome = cadastroAtualizado.Nome;
    usuario.Email = cadastroAtualizado.Email;
    usuario.Senha = cadastroAtualizado.Senha;

    ctx.Usuarios.Update(usuario);
    await ctx.SaveChangesAsync();

    return Results.Ok(usuario);

});

// Criar Evento
app.MapPost("/sistema/evento/criar", async ([FromBody] Evento evento, [FromServices] AppDbContex ctx) => {
    
    Usuario? proprietario = ctx.Usuarios.Find(evento.ProprietarioId);

    if (proprietario == null)
        return Results.NotFound("Usuário não encontrado.");
    
    if (proprietario.Perfil != PerfilEnum.Organizador)
        return Results.BadRequest("Usuário não é um organizador.");

    evento.Proprietario = proprietario;

    ctx.Eventos.Add(evento);
    await ctx.SaveChangesAsync();
    
    return Results.Created("", evento);

}); 

// Deletar Evento
app.MapDelete("/sistema/evento/excluir/{id}", async (int id, [FromServices] AppDbContex ctx) => {

    Evento? evento = ctx.Eventos.Find(id);

    if (evento == null)
        return Results.NotFound();

    ctx.Eventos.Remove(evento);
    await ctx.SaveChangesAsync();

    return Results.Ok(evento);

});

// Listar Eventos
app.MapGet("/sistema/evento/listar", ([FromServices] AppDbContex ctx) => {

    List<Evento> eventos = ctx.Eventos.Include(e => e.Proprietario).ToList();

    if(ctx.Eventos.Any())
        return Results.Ok(eventos);

    return Results.NotFound("Nenhum evento encontrado.");

});

// Inscrever-se em um evento
app.MapPost("/sistema/evento/inscrever", async ([FromBody] Inscricao inscricao, [FromServices] AppDbContex ctx) => {

    Evento? evento = ctx.Eventos.Find(inscricao.EventoId);
    if (evento == null)
        return Results.NotFound("Evento não encontrado.");

    Usuario? usuario = ctx.Usuarios.Find(inscricao.UsuarioId);
    if (usuario == null)
        return Results.NotFound("Usuário não encontrado.");

    if (evento.DataEvento < DateTime.Now)
        return Results.BadRequest("Evento já ocorreu.");
    
    int inscricoes = ctx.Inscricoes.Count(i => i.EventoId == evento.Id);
    if (inscricoes >= evento.VagasMaximo)
        return Results.BadRequest("Evento lotado.");
    
    bool usuario_inscrito = ctx.Inscricoes.FirstOrDefault(i => i.EventoId == evento.Id && i.UsuarioId == usuario.Id) != null;
    if (usuario_inscrito)
        return Results.BadRequest("Usuário já inscrito no evento.");

    inscricao.Evento = evento;
    inscricao.Usuario = usuario;

    ctx.Inscricoes.Add(inscricao);
    await ctx.SaveChangesAsync();

    return Results.Created("", inscricao);

});

// Cancelar inscrição em um evento
app.MapDelete("/sistema/evento/cancelar-inscricao/{id}", async (int id, [FromServices] AppDbContex ctx) => {

    Inscricao? inscricao = ctx.Inscricoes.Find(id);

    if (inscricao == null)
        return Results.NotFound("Innscrição não encontrada.");
    
    ctx.Inscricoes.Remove(inscricao);
    await ctx.SaveChangesAsync();

    return Results.Ok(inscricao);

});

// Listar inscrições de um evento
app.MapGet("/sistema/evento/listar-inscritos/{id}", (int id, [FromServices] AppDbContex ctx) => {

    Evento? evento = ctx.Eventos.Find(id);

    if (evento == null)
        return Results.NotFound("Evento não encontrado.");

    List<Inscricao> inscricoes = ctx.Inscricoes.Include(i => i.Usuario).Include(i => i.Evento.Proprietario).Where(i => i.EventoId == id).ToList();

    if (inscricoes.Any())
        return Results.Ok(inscricoes);

    return Results.NotFound("Nenhuma inscrição encontrada.");

});

// Listar inscrições de um usuário
app.MapGet("/sistema/usuario/listar-inscricoes/{id}", (int id, [FromServices] AppDbContex ctx) => {

    Usuario? usuario = ctx.Usuarios.Find(id);

    if (usuario == null)
        return Results.NotFound("Usuário não encontrado.");

    List<Inscricao> inscricoes = ctx.Inscricoes.Include(i => i.Usuario).Include(i => i.Evento.Proprietario).Where(i => id == i.UsuarioId).ToList();

    if (inscricoes.Any())
        return Results.Ok(inscricoes);

    return Results.NotFound("Nenhuma inscrição encontrada.");

});

app.Run();