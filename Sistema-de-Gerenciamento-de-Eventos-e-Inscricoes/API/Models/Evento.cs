using System;

namespace API.Models;

public class Evento
{
    public int Id { get; set; }
    public string? Nome { get; set; }
    public string? Descricao { get; set; }
    public DateTime DataEvento { get; set; }
    public int VagasMaximo { get; set; }
    public int VagasRestantes { get; set; }
    public Usuario? Proprietario { get; set; }
    public int ProprietarioId { get; set; }
}
