package planEatsBackend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import planEatsBackend.dto.GeladeiraDto;
import planEatsBackend.dto.IncreaseGeladeiraDto;
import planEatsBackend.entities.Geladeira;
import planEatsBackend.entities.Usuario;
import planEatsBackend.repository.UsuarioRepository;
import planEatsBackend.service.GeladeiraService;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/geladeira")
public class GeladeiraController {

  @Autowired
  private GeladeiraService geladeiraService;

  @Autowired
  private UsuarioRepository usuarioRepository;

  private Usuario obterUsuarioAutenticado() {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    String emailUsuarioAutenticado = authentication.getName();
    
    return usuarioRepository.findByEmail(emailUsuarioAutenticado)
        .orElseThrow(() -> new RuntimeException("Usuário autenticado não encontrado"));
  }

  @PostMapping
  @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
  public ResponseEntity<?> adicionarIngredienteNaGeladeira(@RequestBody IncreaseGeladeiraDto dto) {
    Usuario usuarioAutenticado = obterUsuarioAutenticado();
    
    Geladeira salva = geladeiraService.adicionarIngrediente(usuarioAutenticado, dto);
    return ResponseEntity.status(HttpStatus.CREATED).body(salva);
  }

  @GetMapping("/usuario/{usuarioId}")
  @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
  public ResponseEntity<?> listarIngredientesPorUsuario(@PathVariable Long usuarioId) {
    Usuario usuarioAutenticado = obterUsuarioAutenticado();
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

    // Verificar se o usuário está consultando a própria geladeira (exceto ADMIN)
    if (!usuarioAutenticado.getId().equals(usuarioId) && 
        !authentication.getAuthorities().stream()
            .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"))) {
      return ResponseEntity.status(HttpStatus.FORBIDDEN)
          .body("Você não pode visualizar a geladeira de outro usuário");
    }
    
    List<Geladeira> ingredientes = geladeiraService.listarPorUsuario(usuarioId);
    return ResponseEntity.ok(ingredientes);
  }

  @GetMapping("/minha")
  @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
  public ResponseEntity<List<Geladeira>> minhaGeladeira() {
    Usuario usuarioAutenticado = obterUsuarioAutenticado();
    List<Geladeira> ingredientes = geladeiraService.listarPorUsuario(usuarioAutenticado.getId());
    return ResponseEntity.ok(ingredientes);
  }

  @PatchMapping("/{geladeiraId}/incrementar")
  @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
  public ResponseEntity<?> incrementarQuantidade(@PathVariable Long geladeiraId) {
    Usuario usuarioAutenticado = obterUsuarioAutenticado();

    Geladeira geladeira = geladeiraService.buscarPorId(geladeiraId)
        .orElseThrow(() -> new RuntimeException("Item não encontrado na geladeira"));

    if (!geladeiraService.pertenceAoUsuario(geladeira, usuarioAutenticado)) {
      return ResponseEntity.status(HttpStatus.FORBIDDEN)
          .body("Você não pode modificar ingredientes de outra geladeira");
    }

    Geladeira atualizada = geladeiraService.incrementarQuantidade(geladeira);
    return ResponseEntity.ok(atualizada);
  }

  @PatchMapping("/{geladeiraId}/decrementar")
  @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
  public ResponseEntity<?> decrementarQuantidade(@PathVariable Long geladeiraId) {
    Usuario usuarioAutenticado = obterUsuarioAutenticado();

    Geladeira geladeira = geladeiraService.buscarPorId(geladeiraId)
        .orElseThrow(() -> new RuntimeException("Item não encontrado na geladeira"));

    if (!geladeiraService.pertenceAoUsuario(geladeira, usuarioAutenticado)) {
      return ResponseEntity.status(HttpStatus.FORBIDDEN)
          .body("Você não pode modificar ingredientes de outra geladeira");
    }

    Optional<Geladeira> atualizada = geladeiraService.decrementarQuantidade(geladeira);
    
    if (atualizada.isEmpty()) {
      return ResponseEntity.ok().body("Item removido da geladeira");
    }
    
    return ResponseEntity.ok(atualizada.get());
  }

  @DeleteMapping("/{geladeiraId}")
  @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
  public ResponseEntity<?> removerIngrediente(@PathVariable Long geladeiraId) {
    Usuario usuarioAutenticado = obterUsuarioAutenticado();

    Geladeira geladeira = geladeiraService.buscarPorId(geladeiraId)
        .orElseThrow(() -> new RuntimeException("Item não encontrado na geladeira"));

    if (!geladeiraService.pertenceAoUsuario(geladeira, usuarioAutenticado)) {
      return ResponseEntity.status(HttpStatus.FORBIDDEN)
          .body("Você não pode remover ingredientes de outra geladeira");
    }

    geladeiraService.removerIngrediente(geladeira);
    return ResponseEntity.ok().body("Item removido da geladeira com sucesso");
  }
}