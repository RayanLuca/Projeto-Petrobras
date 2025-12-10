using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SistemaEstoqueApi.Data;
using SistemaEstoqueApi.Models;

[Route("api/[controller]")]
[ApiController]
public class PecasController : ControllerBase
{
    private readonly AppDbContext _context;

    public PecasController(AppDbContext context)
    {
        _context = context;
    }

    // GET: api/pecas (Lista para preencher tabelas e selects)
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Peca>>> GetPecas()
    {
        return await _context.Pecas.ToListAsync();
    }

    // POST: api/pecas (Botão "Salvar" da tela de Cadastro)
    [HttpPost]
    public async Task<ActionResult<Peca>> PostPeca(Peca peca)
    {
        _context.Pecas.Add(peca);
        await _context.SaveChangesAsync();
        return CreatedAtAction("GetPecas", new { id = peca.Id }, peca);
    }
}