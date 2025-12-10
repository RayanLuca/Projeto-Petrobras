using Microsoft.AspNetCore.Mvc;
using SistemaEstoqueApi.Data;
using SistemaEstoqueApi.DTOs;
using SistemaEstoqueApi.Models;

[Route("api/[controller]")]
[ApiController]
public class MovimentacoesController : ControllerBase
{
    private readonly AppDbContext _context;

    public MovimentacoesController(AppDbContext context)
    {
        _context = context;
    }

    // POST: api/movimentacoes/saida (Botão "Registrar Saída")
    [HttpPost("saida")]
    public async Task<IActionResult> RegistrarSaida([FromBody] RegistrarSaidaDto dto)
    {
        // 1. Busca a peça no banco
        var peca = await _context.Pecas.FindAsync(dto.PecaId);
        
        if (peca == null) return NotFound("Peça não encontrada.");

        // 2. Valida estoque
        if (peca.Quantidade < dto.Quantidade)
        {
            return BadRequest("Quantidade em estoque insuficiente.");
        }

        // 3. Cria o registro de movimentação
        var movimentacao = new Movimentacao
        {
            PecaId = dto.PecaId,
            Quantidade = dto.Quantidade,
            Tipo = TipoMovimentacao.Saida,
            Observacao = dto.Observacao,
            DataMovimentacao = DateTime.UtcNow
        };

        // 4. Atualiza o saldo da peça
        peca.Quantidade -= dto.Quantidade;

        _context.Movimentacoes.Add(movimentacao);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Saída registrada com sucesso!" });
    }
}