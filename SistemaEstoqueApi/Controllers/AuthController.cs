using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SistemaEstoqueApi.Data;
using SistemaEstoqueApi.DTOs;
using SistemaEstoqueApi.Models;

[Route("api/[controller]")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _context;

    public AuthController(AppDbContext context)
    {
        _context = context;
    }

    // POST: api/auth/cadastro
    [HttpPost("cadastro")]
    public async Task<IActionResult> Cadastro(Usuario usuario)
    {
        // Verifica se email já existe
        if (await _context.Usuarios.AnyAsync(u => u.Email == usuario.Email))
            return BadRequest("Email já cadastrado.");

        _context.Usuarios.Add(usuario);
        await _context.SaveChangesAsync();
        return Ok(new { message = "Usuário criado com sucesso" });
    }

    // POST: api/auth/login
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto login)
    {
        var usuario = await _context.Usuarios
            .FirstOrDefaultAsync(u => u.Email == login.Email && u.Senha == login.Senha);

        if (usuario == null)
            return Unauthorized("Usuário ou senha inválidos");

        // Aqui você retornaria um Token JWT em uma aplicação real
        return Ok(new { 
            message = "Login realizado", 
            usuarioId = usuario.Id, 
            nome = usuario.NomeCompleto 
        });
    }
}