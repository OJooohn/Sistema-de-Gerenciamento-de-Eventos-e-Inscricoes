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

// Listar Usuários
app.MapGet("/sistema/usuario/listar", async ([FromServices] AppDbContex ctx) =>
{
    var usuarios = await ctx.Usuarios.ToListAsync();

    if (usuarios == null)
    {
        return Results.NotFound("Nenhum usuário encontrado.");
    }

    return Results.Ok(usuarios);
});

// Buscar Usuário
app.MapGet("/sistema/usuario/buscar/{email}", async ([FromRoute] string? email, [FromServices] AppDbContex ctx) => {
    if (string.IsNullOrWhiteSpace(email))
    {
        return Results.BadRequest(new { mensagem = "Não foi possível consultar usuário: Erro ao receber 'Email' pela url." });
    }

    var usuario = await ctx.Usuarios.FirstOrDefaultAsync(x => x.Email == email);

    if (usuario == null)
    {
        return Results.NotFound("Usuário não encontrado.");
    }

    return Results.Ok(usuario);
});

// Registrar Usuário
app.MapPost("/sistema/usuario/registrar", async ([FromBody] Usuario usuario, [FromServices] AppDbContex ctx) =>
{
    // VALIDAÇÃO DOS CAMPOS
    if (string.IsNullOrWhiteSpace(usuario.Nome))
    {
        return Results.BadRequest(new { mensagem = "O campo 'Nome' é obrigatório." });
    }

    if (string.IsNullOrWhiteSpace(usuario.Email))
    {
        return Results.BadRequest(new { mensagem = "O campo 'Email' é obrigatório." });
    }

    if (string.IsNullOrWhiteSpace(usuario.Senha))
    {
        return Results.BadRequest(new { mensagem = "O campo 'Senha' é obrigatório." });
    }

    // VERIFICA SE O EMAIL JÁ ESTÁ CADASTRADO
    var emailExiste = await ctx.Usuarios.AnyAsync(u => u.Email == usuario.Email);
    if (emailExiste)
    {
        return Results.BadRequest(new { mensagem = "O email fornecido já está cadastrado." });
    }

    try
    {
        ctx.Usuarios.Add(usuario);
        await ctx.SaveChangesAsync();
    }
    catch (Exception e)
    {
        return Results.Problem(detail: e.Message);
    }

    // CONSULTA E RETORNA A LISTA DE USUÁRIOS ATUALIZADA
    var usuarios = await ctx.Usuarios.ToListAsync();
    return Results.Ok(usuarios);
});


// Deletar Usuário
app.MapDelete("/sistema/usuario/deletar/{id}", async ([FromRoute] int id, [FromServices] AppDbContex ctx) => {

    Usuario? usuario = ctx.Usuarios.Find(id);
    if (usuario == null)
        return Results.NotFound("Usuário não encontrado.");
    
    try
    {
        ctx.Usuarios.Remove(usuario);
        await ctx.SaveChangesAsync();
    }
    catch (Exception e)
    {
        return Results.Problem(detail: e.Message);
    }

    var usuarios = await ctx.Usuarios.ToListAsync();

    return Results.Ok(usuarios);
});

// Atualizar Usuário
app.MapPut("/sistema/usuario/atualizar/{id}", async ([FromRoute] int id, [FromBody] Usuario cadastroAtualizado, [FromServices] AppDbContex ctx) => {

    Usuario? usuario = ctx.Usuarios.Find(id);
    if (usuario == null)
        return Results.NotFound();

    // VALIDAÇÃO DOS CAMPOS
    if (string.IsNullOrWhiteSpace(cadastroAtualizado.Nome))
    {
        return Results.BadRequest(new { mensagem = "O campo 'Nome' é obrigatório." });
    }

    if (string.IsNullOrWhiteSpace(cadastroAtualizado.Email))
    {
        return Results.BadRequest(new { mensagem = "O campo 'Email' é obrigatório." });
    }

    if (string.IsNullOrWhiteSpace(cadastroAtualizado.Senha))
    {
        return Results.BadRequest(new { mensagem = "O campo 'Senha' é obrigatório." });
    }

    usuario.Nome = cadastroAtualizado.Nome;
    usuario.Email = cadastroAtualizado.Email;
    usuario.Senha = cadastroAtualizado.Senha;

    try
    {
        ctx.Usuarios.Update(usuario);
        await ctx.SaveChangesAsync();
    }
    catch (Exception e)
    {
        return Results.Problem(detail: e.Message);
    }

    return Results.Ok(usuario);
});

// Listar Eventos
app.MapGet("/sistema/evento/listar", async ([FromServices] AppDbContex ctx) => {

    List<Evento> eventos = await ctx.Eventos.Include(e => e.Proprietario).ToListAsync();

    if (eventos == null)
    {
        return Results.NotFound("Nenhum evento encontrado.");
    }

    return Results.Ok(eventos);
});

// Procurar Evento por id
app.MapGet("/sistema/evento/buscar/{id}", async ([FromRoute] int id, [FromServices] AppDbContex ctx) => {
    var evento = await ctx.Eventos.FindAsync(id);

    if (evento == null)
    {
        return Results.NotFound("Nenhum evento encontrado.");
    }

    return Results.Ok(evento);
});

// Criar Evento
app.MapPost("/sistema/evento/criar", async ([FromBody] Evento evento, [FromServices] AppDbContex ctx) =>
{
    // VALIDAÇÃO DOS CAMPOS
    if (string.IsNullOrWhiteSpace(evento.Nome))
    {
        return Results.BadRequest(new { mensagem = "O campo 'Nome' é obrigatório." });
    }

    if (string.IsNullOrWhiteSpace(evento.Descricao))
    {
        return Results.BadRequest(new { mensagem = "O campo 'Descricao' é obrigatório." });
    }

    if (evento.DataEvento == default(DateTime))
    {
        return Results.BadRequest(new { mensagem = "O campo 'DataEvento' está em branco ou inválido." });
    }

    var proprietario = await ctx.Usuarios.FindAsync(evento.ProprietarioId);
    
    if (proprietario == null)
    {
        return Results.BadRequest(new { mensagem = "Usuário não encontrado." });
    }

    if (proprietario.Perfil != PerfilEnum.Organizador)
    {
        return Results.BadRequest(new { mensagem = "Usuário não é um organizador." });
    }

    evento.Proprietario = proprietario;

    try
    {
        ctx.Eventos.Add(evento);
        await ctx.SaveChangesAsync();
    }
    catch (Exception e)
    {
        return Results.Problem(detail: e.Message);
    }

    var eventos = await ctx.Eventos.ToListAsync();

    return Results.Ok(eventos);
});


// Deletar Evento
app.MapDelete("/sistema/evento/excluir/{id}", async ([FromRoute] int id, [FromServices] AppDbContex ctx) => {

    var evento = await ctx.Eventos.FindAsync(id);

    if (evento == null)
        return Results.NotFound("Evento não encontrado.");

    try
    {
        ctx.Eventos.Remove(evento);
        await ctx.SaveChangesAsync();
    }
    catch (Exception e)
    {
        return Results.Problem(detail: e.Message);
    }

    return Results.Ok(evento);
});

// Alterar cadastro do evento 
app.MapPut("/sistema/evento/alterar/{id}", async ([FromRoute] int id, [FromBody] Evento eventoAlterado, [FromServices] AppDbContex ctx) => {
    var evento = await ctx.Eventos.FindAsync(id);

    if (evento == null)
    {
        return Results.NotFound("Nenhum evento encontrado.");
    }

    // VALIDAÇÃO DOS CAMPOS
    if(string.IsNullOrWhiteSpace(eventoAlterado.Nome))
    {
        return Results.BadRequest(new { mensagem = "O campo 'Nome' é obrigatório." });
    }

    if(string.IsNullOrWhiteSpace(eventoAlterado.Descricao))
    {
        return Results.BadRequest(new { mensagem = "O campo 'Descricao' é obrigatório." });
    }

    if(eventoAlterado.VagasMaximo <= 0)
    {
        return Results.BadRequest(new { mensagem = "Número de vagas é inválido" });
    }

    var usuario = await ctx.Usuarios.FindAsync(eventoAlterado.ProprietarioId);
    if(usuario == null)
    {
        return Results.BadRequest(new { mensagem = "Usuário não encontrado com o id." });
    }

    if(usuario.Id != eventoAlterado.ProprietarioId)
    {
        return Results.BadRequest(new { mensagem = "Erro ao editar evento: Usuário não é o proprietário." });
    }

    evento.Nome = eventoAlterado.Nome;
    evento.Descricao = eventoAlterado.Descricao;
    evento.DataEvento = eventoAlterado.DataEvento;
    evento.VagasMaximo = eventoAlterado.VagasMaximo;

    try
    {
        ctx.Eventos.Update(evento);
        await ctx.SaveChangesAsync();
    }
    catch (Exception e)
    {
        return Results.Problem(detail: e.Message);
    }

    return Results.Ok(evento);
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

    try
    {
        ctx.Inscricoes.Add(inscricao);
        await ctx.SaveChangesAsync();
    }
    catch (Exception e)
    {
        return Results.Problem(detail: e.Message);
    }

    return Results.Created("", inscricao);
});

// Cancelar inscrição em um evento
app.MapDelete("/sistema/evento/cancelar-inscricao/{id_usuario}/{id_evento}", async ([FromRoute] int id_usuario, int id_evento, [FromServices] AppDbContex ctx) => {

    Inscricao? inscricao = await ctx.Inscricoes.FirstOrDefaultAsync(x => x.UsuarioId == id_usuario && x.EventoId == id_evento);

    if (inscricao == null)
        return Results.NotFound("Inscrição não encontrada.");
    
    try
    {
        ctx.Inscricoes.Remove(inscricao);
        await ctx.SaveChangesAsync();
    }
    catch (Exception e)
    {
        return Results.Problem(detail: e.Message);
    }

    return Results.Ok(inscricao);
});

// Listar inscrições de um evento
app.MapGet("/sistema/evento/listar-inscritos/{id}", async ([FromRoute] int id, [FromServices] AppDbContex ctx) => {

    var evento = await ctx.Eventos.FindAsync(id);

    if (evento == null)
        return Results.NotFound("Evento não encontrado.");

    List<Inscricao> inscricoes = await ctx.Inscricoes.Include(i => i.Usuario).Include(i => i.Evento!.Proprietario).Where(i => i.EventoId == id).ToListAsync();

    if(inscricoes == null)
    {
        return Results.NotFound("Nenhuma inscrição encontrada");
    }

    return Results.Ok(inscricoes);
});

// Listar inscrições de um usuário
app.MapGet("/sistema/usuario/listar-inscricoes/{id}", async ([FromRoute] int id, [FromServices] AppDbContex ctx) => {

    var usuario = await ctx.Usuarios.FindAsync(id);

    if (usuario == null)
        return Results.NotFound("Usuário não encontrado.");

    List<Inscricao> inscricoes = await ctx.Inscricoes.Include(i => i.Usuario).Include(i => i.Evento!.Proprietario).Where(i => id == i.UsuarioId).ToListAsync();

    if (inscricoes.Any())
        return Results.Ok(inscricoes);

    return Results.NotFound("Nenhuma inscrição encontrada.");
});

// Buscar inscrição por id do usuário e do evento
app.MapGet("/sistema/usuario/buscar-inscricao/{id_usuario}/{id_evento}", async ([FromRoute] int id_usuario, int id_evento, [FromServices] AppDbContex ctx) => {

    var inscricao = await ctx.Inscricoes.FirstOrDefaultAsync(x => x.UsuarioId == id_usuario && x.EventoId == id_evento);

    if(inscricao == null)
    {
        return Results.NotFound("Inscrição não encontrada. Verificar id do usuário e do evento.");
    }

    return Results.Ok(inscricao);
});

app.Run();