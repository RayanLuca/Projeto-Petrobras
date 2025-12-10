namespace SistemaEstoqueApi.Models
{
    public class Movimentacao
    {
        public int Id { get; set; }
        public int PecaId { get; set; } // Chave estrangeira
        public TipoMovimentacao Tipo { get; set; }
        public int Quantidade { get; set; }
        public string? Observacao { get; set; }
        public DateTime DataMovimentacao { get; set; } = DateTime.UtcNow;

        // Propriedade de navegação (opcional, para incluir dados da peça na consulta)
        public Peca? Peca { get; set; }
    }
}