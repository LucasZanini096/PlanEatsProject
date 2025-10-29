package planEatsBackend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import planEatsBackend.dto.ReceitaRequestDto;
import planEatsBackend.dto.ReceitaResponseDto;
import planEatsBackend.entities.Usuario;
import planEatsBackend.repository.UsuarioRepository;
import planEatsBackend.service.ReceitaService;

import java.util.List;

@RestController
@RequestMapping("/api/receitas")
public class ReceitaController {

    @Autowired
    private ReceitaService receitaService;

    @Autowired
    private UsuarioRepository usuarioRepository;

    private Usuario obterUsuarioAutenticado() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String emailUsuarioAutenticado = authentication.getName();
        
        return usuarioRepository.findByEmail(emailUsuarioAutenticado)
            .orElseThrow(() -> new RuntimeException("Usuário autenticado não encontrado"));
    }

    @PostMapping("/gerar")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<ReceitaResponseDto> gerarReceita(@RequestBody ReceitaRequestDto request) {
        Usuario usuario = obterUsuarioAutenticado();
        ReceitaResponseDto receita = receitaService.gerarReceita(usuario, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(receita);
    }

    @GetMapping("/minhas")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<List<ReceitaResponseDto>> listarMinhasReceitas() {
        Usuario usuario = obterUsuarioAutenticado();
        List<ReceitaResponseDto> receitas = receitaService.listarReceitasDoUsuario(usuario);
        return ResponseEntity.ok(receitas);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<ReceitaResponseDto> buscarReceita(@PathVariable Long id) {
        Usuario usuario = obterUsuarioAutenticado();
        ReceitaResponseDto receita = receitaService.buscarPorId(id, usuario);
        return ResponseEntity.ok(receita);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<?> deletarReceita(@PathVariable Long id) {
        Usuario usuario = obterUsuarioAutenticado();
        receitaService.deletarReceita(id, usuario);
        return ResponseEntity.ok().body("Receita deletada com sucesso");
    }
}