namespace SistemaEstoqueApi.DTOs
{
    public class RegistrarSaidaDto
    {
        public int PecaId { get; set; }
        public int Quantidade { get; set; }
        public string? Observacao { get; set; }
    }
}