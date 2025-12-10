using System.ComponentModel.DataAnnotations.Schema;

namespace SistemaEstoqueApi.Models
{
    public class Peca
    {
        public int Id { get; set; }
        public string Codigo { get; set; } = string.Empty; // Ex: PC001
        public string Nome { get; set; } = string.Empty;
        public CategoriaPeca Categoria { get; set; }
        public string Localizacao { get; set; } = string.Empty; // Ex: A1-P3
        public int Quantidade { get; set; }
        public UnidadeMedida Unidade { get; set; }
        
        [Column(TypeName = "decimal(18,2)")]
        public decimal ValorUnitario { get; set; }
    }
}