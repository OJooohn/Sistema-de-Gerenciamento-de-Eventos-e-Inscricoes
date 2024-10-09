using System;
using Microsoft.EntityFrameworkCore;

namespace API.Models;

public class AppDbContex : DbContext
{
    public DbSet<Usuario> Usuarios { get; set; }
    public DbSet<Evento> Eventos { get; set; }
    public DbSet<Inscricao> Inscricoes { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.UseSqlite("Data Source=SistemaEventos.db");
    }
}
