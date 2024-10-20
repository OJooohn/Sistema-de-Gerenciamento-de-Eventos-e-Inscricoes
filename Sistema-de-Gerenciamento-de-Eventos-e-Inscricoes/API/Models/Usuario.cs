using System;
using API.Enums;

namespace API.Models
{
    public class Usuario
    {
        public int Id { get; set; }
        public string? Nome { get; set; }
        public string? Email { get; set; }
        private string? senha;
        public PerfilEnum Perfil { get; set; }

        public string? Senha
        {
            get { return senha; }
            set { senha = value != null ? new string('*', value.Length) : null; }
        }

        public string? GetSenhaMascarada()
        {
            return senha;
        }
    }
}
