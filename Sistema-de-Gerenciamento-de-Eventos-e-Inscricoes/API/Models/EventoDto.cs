using System;
using API.Enums;

public class EventoDto {
    public int Id { get; set; }
    public string? Nome { get; set; }
    public string? Descricao { get; set; }
    public DateTime DataEvento { get; set; }
    public int VagasMaximo { get; set; }
    public int VagasRestantes { get; set; }
    public UsuarioDto? Proprietario { get; set; }
}