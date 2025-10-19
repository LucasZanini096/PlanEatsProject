package planEatsBackend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import planEatsBackend.dto.IngredienteDto;
import planEatsBackend.entities.Ingrediente;
import planEatsBackend.service.IngredienteService;

import java.util.List;

@RestController
@RequestMapping("/api/ingredientes")
public class IngredienteController {

  @Autowired
  private IngredienteService ingredienteService;

  @PostMapping
  @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
  public ResponseEntity<Ingrediente> criarIngrediente(@RequestBody IngredienteDto dto) {
    Ingrediente salvo = ingredienteService.criarIngrediente(dto);
    return ResponseEntity.status(HttpStatus.CREATED).body(salvo);
  }

  @GetMapping
  @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
  public ResponseEntity<List<Ingrediente>> listarIngredientes() {
    return ResponseEntity.ok(ingredienteService.listarTodos());
  }

  @DeleteMapping("/{id}")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<?> deletarIngrediente(@PathVariable Long id) {
    ingredienteService.deletarIngrediente(id);
    return ResponseEntity.ok().body("Ingrediente deletado com sucesso");
  }
}