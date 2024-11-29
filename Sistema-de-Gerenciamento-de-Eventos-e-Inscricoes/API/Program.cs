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

builder.Services.AddCors(options =>
    options.AddPolicy("Acesso Total",
        configs => configs
            .AllowAnyOrigin()
            .AllowAnyHeader()
            .AllowAnyMethod())
);

var app = builder.Build();

// Middleware global de tratamento de exceções
app.UseMiddleware<ExceptionHandlingMiddleware>();

app.UseCors("Acesso Total");

app.MapGet("/", () => "Sistema de Gerenciamento de Eventos e Inscrições");

/* 
    ENDPOINTS DE USUARIO
*/

// Listar Usuários
app.MapGet("/sistema/usuario/listar", async ([FromServices] AppDbContex ctx) => {
    if (await ctx.Usuarios.AnyAsync())
        return Results.Ok(await ctx.Usuarios.ToListAsync());

    return Results.NotFound("Nenhum usuário encontrado.");
});

// Buscar Usuário por Email
app.MapGet("/sistema/usuario/buscar/{email}", async ([FromRoute] string? email, [FromServices] AppDbContex ctx) => {
    if (string.IsNullOrWhiteSpace(email))
        return Results.BadRequest(new { mensagem = "O campo 'Email' é obrigatório." });

    Usuario? usuario = await ctx.Usuarios.FirstOrDefaultAsync(x => x.Email == email);

    if (usuario == null)
        return Results.NotFound(new { mensagem = "Usuário não encontrado." });

    return Results.Ok(usuario);
});

// Buscar Usuário por ID (sem senha)
app.MapGet("/sistema/usuario/basico/buscarID/{id}", async ([FromRoute] int? id, [FromServices] AppDbContex ctx) => {

    if (id is null)
        return Results.BadRequest(new { mensagem = "O campo 'ID' é obrigatório." });

    Usuario? usuario = await ctx.Usuarios
    .Select(u => new Usuario {
        Id = u.Id,
        Nome = u.Nome,
        Email = u.Email,
        Perfil = u.Perfil
    }).FirstOrDefaultAsync(x => x.Id == id);

    if (usuario == null)
        return Results.NotFound(new { mensagem = "Usuário não encontrado." });

    return Results.Ok(usuario);
});

// Buscar Usuário por ID (com senha)
app.MapGet("/sistema/usuario/completo/buscarID/{id}", ([FromRoute] int? id, [FromServices] AppDbContex ctx) =>{

    if (id is null)
        return Results.BadRequest(new { mensagem = "O campo 'ID' é obrigatório." });

    Usuario? usuario = ctx.Usuarios.Find(id);

    if (usuario == null)
        return Results.NotFound(new { mensagem = "Usuário não encontrado." });

    return Results.Ok(usuario);
});

// Registrar Usuário
app.MapPost("/sistema/usuario/registrar", async ([FromBody] Usuario usuario, [FromServices] AppDbContex ctx) => {
    // Validação dos campos
    if (string.IsNullOrWhiteSpace(usuario.Nome))
        return Results.BadRequest(new { mensagem = "O campo 'Nome' é obrigatório." });

    if (string.IsNullOrWhiteSpace(usuario.Email))
        return Results.BadRequest(new { mensagem = "O campo 'Email' é obrigatório." });

    if (string.IsNullOrWhiteSpace(usuario.Senha) || usuario.Senha == string.Empty)
        return Results.BadRequest(new { mensagem = "O campo 'Senha' é obrigatório." });

    // Verifica se o email já está cadastrado
    bool emailExiste = await ctx.Usuarios.AnyAsync(u => u.Email == usuario.Email);
    if (emailExiste)
        return Results.BadRequest(new { mensagem = "O email fornecido já está cadastrado." });

    try {

        ctx.Usuarios.Add(usuario);
        await ctx.SaveChangesAsync();
        return Results.Created("", usuario);
        
    } catch (Exception e) {

        return Results.Problem(detail: e.Message);

    }
});

// Deletar Usuário
app.MapDelete("/sistema/usuario/deletar/{id}", async ([FromRoute] int id, [FromServices] AppDbContex ctx) => {
    Usuario? usuario = await ctx.Usuarios.FindAsync(id);
    if (usuario == null)
        return Results.NotFound(new { mensagem = "Usuário não encontrado." });

    try {

        ctx.Usuarios.Remove(usuario);
        await ctx.SaveChangesAsync();
        return Results.Ok(usuario);

    } catch (Exception e) {

        return Results.Problem(detail: e.Message);

    }
});

// Atualizar Usuário
app.MapPut("/sistema/usuario/atualizar/{id}", async ([FromRoute] int id, [FromBody] Usuario cadastroAtualizado, [FromServices] AppDbContex ctx) => {
    var usuario = await ctx.Usuarios.FindAsync(id);
    if (usuario == null)
        return Results.NotFound(new { mensagem = "Usuário não encontrado." });

    // Validação dos campos
    if (string.IsNullOrWhiteSpace(cadastroAtualizado.Nome))
        return Results.BadRequest(new { mensagem = "O campo 'Nome' é obrigatório." });

    if (string.IsNullOrWhiteSpace(cadastroAtualizado.Email))
        return Results.BadRequest(new { mensagem = "O campo 'Email' é obrigatório." });

    usuario.Nome = cadastroAtualizado.Nome;
    usuario.Email = cadastroAtualizado.Email;

    try {

        ctx.Usuarios.Update(usuario);
        await ctx.SaveChangesAsync();
        return Results.Ok(usuario);

    } catch (Exception e) {

        return Results.Problem(detail: e.Message);

    }
});

/* 
    ENDPOINTS DE EVENTO
*/

// Listar Eventos
app.MapGet("/sistema/evento/listar", async ([FromServices] AppDbContex ctx) => {

    List<Evento> eventos = await ctx.Eventos
        .Include(e => e.Proprietario)
        .Select(e => new Evento {
            Id = e.Id,
            Nome = e.Nome,
            Descricao = e.Descricao,
            DataEvento = e.DataEvento,
            VagasMaximo = e.VagasMaximo,
            VagasRestantes = e.VagasRestantes,
            Proprietario = new Usuario { Nome = e.Proprietario!.Nome }
        })
        .ToListAsync();

    if (eventos == null || eventos.Count == 0)
        return Results.NotFound("Nenhum evento encontrado.");

    return Results.Ok(eventos);
});

// Listar Eventos de um Proprietário (ID)
app.MapGet("/sistema/evento/meus-eventos/{id}", async ([FromRoute] int id, [FromServices] AppDbContex ctx) => {
    
    List<Evento> eventos = await ctx.Eventos
        .Include(e => e.Proprietario)
        .Where(e => e.ProprietarioId == id)
        .Select(e => new Evento {
            Id = e.Id,
            Nome = e.Nome,
            Descricao = e.Descricao,
            DataEvento = e.DataEvento,
            VagasMaximo = e.VagasMaximo,
            VagasRestantes = e.VagasRestantes,
            Proprietario = new Usuario { Nome = e.Proprietario!.Nome }
        })
        .ToListAsync();

    if (eventos == null)
        return Results.NotFound("Nenhum evento encontrado.");

    return Results.Ok(eventos);
});

// Buscar Evento por ID de Evento
app.MapGet("/sistema/evento/buscar/{id}", async ([FromRoute] int id, [FromServices] AppDbContex ctx) => {
    Evento? evento = await ctx.Eventos.Include(e => e.Proprietario).FirstOrDefaultAsync(e => e.Id == id);

    if (evento == null)
        return Results.NotFound(new { mensagem = "Evento não encontrado." });

    return Results.Ok(evento);
});


// Criar Evento
app.MapPost("/sistema/evento/criar", async ([FromBody] Evento evento, [FromServices] AppDbContex ctx) => {
    // Validação dos campos
    if (string.IsNullOrWhiteSpace(evento.Nome))
        return Results.BadRequest(new { mensagem = "O campo 'Nome' é obrigatório." });

    if (string.IsNullOrWhiteSpace(evento.Descricao))
        return Results.BadRequest(new { mensagem = "O campo 'Descrição' é obrigatório." });

    if (evento.DataEvento == default)
        return Results.BadRequest(new { mensagem = "O campo 'DataEvento' está em branco ou inválido." });

    Usuario? proprietario = await ctx.Usuarios.FindAsync(evento.ProprietarioId);

    if (proprietario == null)
        return Results.BadRequest(new { mensagem = "Proprietário não encontrado." });

    if (proprietario.Perfil != PerfilEnum.Organizador)
        return Results.BadRequest(new { mensagem = "Usuário não é um organizador." });

    evento.Proprietario = proprietario;
    evento.VagasRestantes = evento.VagasMaximo;

    try {
        ctx.Eventos.Add(evento);
        await ctx.SaveChangesAsync();
        return Results.Created("", evento);
    }

    catch (Exception e) {

        return Results.Problem(detail: e.Message);

    }
});

// Deletar Evento
app.MapDelete("/sistema/evento/excluir/{id}", async ([FromRoute] int id, [FromServices] AppDbContex ctx) => {
    Evento? evento = await ctx.Eventos.FindAsync(id);

    if (evento == null)
        return Results.NotFound(new { mensagem = "Evento não encontrado." });

    try {

        ctx.Eventos.Remove(evento);
        await ctx.SaveChangesAsync();
        return Results.Ok(evento);

    } catch (Exception e) {

        return Results.Problem(detail: e.Message);

    }
});

// Alterar informacoes do evento
app.MapPut("/sistema/evento/alterar/{id}", async ([FromRoute] int id, [FromBody] Evento eventoAlterado, [FromServices] AppDbContex ctx) => {
    Evento? evento = await ctx.Eventos.FindAsync(id);

    if (evento == null)
        return Results.NotFound(new { mensagem = "Evento não encontrado." });

    // Validação dos campos
    if (string.IsNullOrWhiteSpace(eventoAlterado.Nome))
        return Results.BadRequest(new { mensagem = "O campo 'Nome' é obrigatório." });

    if (string.IsNullOrWhiteSpace(eventoAlterado.Descricao))
        return Results.BadRequest(new { mensagem = "O campo 'Descrição' é obrigatório." });

    if (eventoAlterado.VagasMaximo <= 0)
        return Results.BadRequest(new { mensagem = "Número de vagas inválido." });

    if (evento.ProprietarioId != eventoAlterado.ProprietarioId)
        return Results.BadRequest(new { mensagem = "Usuário não é o proprietário do evento." });

    evento.Nome = eventoAlterado.Nome;
    evento.Descricao = eventoAlterado.Descricao;
    evento.DataEvento = eventoAlterado.DataEvento;
    evento.VagasMaximo = eventoAlterado.VagasMaximo;

    int totalInscricoes = await ctx.Inscricoes.CountAsync(i => i.EventoId == evento.Id);
    evento.VagasRestantes = evento.VagasMaximo - totalInscricoes;

    try {

        ctx.Eventos.Update(evento);
        await ctx.SaveChangesAsync();
        return Results.Ok(evento);

    } catch (Exception e) {
        
        return Results.Problem(detail: e.Message);

    }
});

/* 
    ENDPOINTS DE INSCRICAO
*/

// Listar inscrições de um Evento (ID Evento)
app.MapGet("/sistema/evento/listar-inscritos/{id}", async ([FromRoute] int id, [FromServices] AppDbContex ctx) => {
    Evento? evento = await ctx.Eventos.FindAsync(id);

    if (evento == null)
        return Results.NotFound(new { mensagem = "Evento não encontrado." });

    List<Inscricao> inscricoes = await ctx.Inscricoes
        .Include(i => i.Usuario)
        .Where(i => i.EventoId == id)
        .ToListAsync();

    if (inscricoes.Count == 0)
        return Results.NotFound("Nenhuma inscrição encontrada.");

    return Results.Ok(inscricoes);
});

// Listar inscrições de um usuário (ID Usuario)
app.MapGet("/sistema/usuario/listar-inscricoes/{id:int}", async ([FromRoute] int id, [FromServices] AppDbContex ctx) => {
    Usuario? usuario = await ctx.Usuarios.FindAsync(id);

    if (usuario == null)
        return Results.NotFound(new { mensagem = "Usuário não encontrado." });

    List<Inscricao> inscricoes = await ctx.Inscricoes
        .Include(i => i.Evento)
        .Where(i => i.UsuarioId == id)
        .ToListAsync();

    if (inscricoes.Count == 0)
        return Results.NotFound("Nenhuma inscrição encontrada.");

    return Results.Ok(inscricoes);
});

// Buscar inscrição por usuario e evento (ID Usuario e ID Evento)
app.MapGet("/sistema/usuario/buscar-inscricao/{id_usuario}/{id_evento}", async ([FromRoute] int id_usuario, [FromRoute] int id_evento, [FromServices] AppDbContex ctx) => {
    Inscricao? inscricao = await ctx.Inscricoes
        .Include(i => i.Usuario)
        .Include(i => i.Evento)
        .FirstOrDefaultAsync(x => x.UsuarioId == id_usuario && x.EventoId == id_evento);

    if (inscricao == null)
        return Results.NotFound(new { mensagem = "Inscrição não encontrada." });

    return Results.Ok(inscricao);
});

// Inscrever-se em um evento
app.MapPost("/sistema/evento/inscrever", async ([FromBody] Inscricao inscricao, [FromServices] AppDbContex ctx) => {
    Evento? evento = await ctx.Eventos.FindAsync(inscricao.EventoId);
    if (evento == null)
        return Results.NotFound(new { mensagem = "Evento não encontrado." });

    Usuario? usuario = await ctx.Usuarios.FindAsync(inscricao.UsuarioId);
    if (usuario == null)
        return Results.NotFound(new { mensagem = "Usuário não encontrado." });

    if (evento.DataEvento < DateTime.Now)
        return Results.BadRequest(new { mensagem = "Evento já ocorreu." });

    int totalInscricoes = await ctx.Inscricoes.CountAsync(i => i.EventoId == evento.Id);
    if (totalInscricoes >= evento.VagasMaximo)
        return Results.BadRequest(new { mensagem = "Evento lotado." });

    bool usuarioInscrito = await ctx.Inscricoes.AnyAsync(i => i.EventoId == evento.Id && i.UsuarioId == usuario.Id);
    if (usuarioInscrito)
        return Results.BadRequest(new { mensagem = "Usuário já inscrito no evento." });

    try {
        evento.VagasRestantes--;

        ctx.Inscricoes.Add(inscricao);
        await ctx.SaveChangesAsync();
        return Results.Created("", inscricao);

    } catch (Exception e) {

        return Results.Problem(detail: e.Message);

    }
});

// Cancelar inscrição em um evento
app.MapDelete("/sistema/evento/cancelar-inscricao", async ([FromBody] Inscricao inscricaoCancelar, [FromServices] AppDbContex ctx) => {

    Inscricao? inscricao = await ctx.Inscricoes.FirstOrDefaultAsync(x => x.UsuarioId == inscricaoCancelar.UsuarioId && x.EventoId == inscricaoCancelar.EventoId);

    if (inscricao == null)
        return Results.NotFound(new { mensagem = "Inscrição não encontrada." });

    Evento? evento = await ctx.Eventos.FindAsync(inscricao.EventoId);

    if (evento == null)
        return Results.NotFound(new { mensagem = "Evento não encontrado." });

    try {
        ctx.Inscricoes.Remove(inscricao);

        evento.VagasRestantes++;
        await ctx.SaveChangesAsync();
        return Results.Ok(inscricao);
        
    } catch (Exception e) {

        return Results.Problem(detail: e.Message);

    }
});

app.Run();

// Definição do middleware global de tratamento de exceções
public class ExceptionHandlingMiddleware {
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionHandlingMiddleware> _logger;

    public ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger) {
        _next = next;
        _logger = logger;
    }

    public async Task Invoke(HttpContext httpContext) {
        try {

            await _next(httpContext);

        } catch (Exception ex) {

            _logger.LogError(ex, "Ocorreu um erro inesperado.");
            httpContext.Response.StatusCode = 500;
            await httpContext.Response.WriteAsJsonAsync(new { mensagem = "Ocorreu um erro inesperado no servidor. Tente novamente mais tarde." });

        }
    }
}