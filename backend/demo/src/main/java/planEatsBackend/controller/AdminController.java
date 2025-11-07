package planEatsBackend.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import planEatsBackend.dto.UsuarioDto;
import planEatsBackend.entities.Usuario;
import planEatsBackend.mapper.UsuarioMapper;
import planEatsBackend.service.UsuarioService;


@RestController
@RequestMapping("/api/admin/users")
public class AdminController {

    private final UsuarioService usuarioService;

    public AdminController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ResponseEntity<UsuarioDto> getUserById(@PathVariable Long id) {
        Usuario user = usuarioService.findById(id);
        return ResponseEntity.ok(UsuarioMapper.toDto(user));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ResponseEntity<List<UsuarioDto>> listAll() {
        return ResponseEntity.ok(
            usuarioService.findAll().stream()
                .map(UsuarioMapper::toDto)
                .collect(Collectors.toList())
        );
    }
    

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        usuarioService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

}