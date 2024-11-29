using System;
using API.Enums;

namespace API.Models
{
    public class Usuario
    {
        public int Id { get; set; }
        public string? Nome { get; set; }
        public string? Email { get; set; }
        public PerfilEnum Perfil { get; set; }
        public string? Senha { get; set; }
    }
}
