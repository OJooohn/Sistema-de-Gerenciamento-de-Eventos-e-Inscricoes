using System;

namespace API.Models;

public class Inscricao
{
    public int Id { get; set; }
    public Evento? Evento { get; set; }
    public int EventoId { get; set; }
    public Usuario? Usuario { get; set; }
    public int UsuarioId { get; set; }
}
