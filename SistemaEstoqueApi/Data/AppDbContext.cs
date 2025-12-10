using Microsoft.EntityFrameworkCore;
using SistemaEstoqueApi.Models;

namespace SistemaEstoqueApi.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Peca> Pecas { get; set; }
        public DbSet<Usuario> Usuarios { get; set; }
        public DbSet<Movimentacao> Movimentacoes { get; set; }
    }
}