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
        public string? Senha
        {
            get { return senha != null ? "******" : null; }
            set { senha = value; }
        }
        public PerfilEnum Perfil { get; set; }
    }
}
