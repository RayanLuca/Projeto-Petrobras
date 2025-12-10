namespace SistemaEstoqueApi.Models
{
    public enum CategoriaPeca // peças a serem selecionadas no cadastro
    {
        Perifericos,
        Cabos,
        Hardware,
        Software
    }

    public enum UnidadeMedida
    {
        UN, // Unidade
        KG, // Quilograma
        M,  // Metro
        L,  // Litro
        CX  // Caixa
    }

    public enum TipoMovimentacao
    {
        Entrada,
        Saida
    }
}