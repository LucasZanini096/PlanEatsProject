package planEatsBackend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import planEatsBackend.dto.IngredienteDto;
import planEatsBackend.entities.Ingrediente;
import planEatsBackend.repository.IngredienteRepository;

import java.util.List;
import java.util.Optional;

@Service
public class IngredienteService {
  
  @Autowired
  private IngredienteRepository ingredienteRepository;

  public Ingrediente criarIngrediente(IngredienteDto dto) {
    Ingrediente ingrediente = new Ingrediente();
    ingrediente.setNome(dto.getNome());
    return ingredienteRepository.save(ingrediente);
  }

  public List<Ingrediente> listarTodos() {
    return ingredienteRepository.findAll();
  }

  public Optional<Ingrediente> buscarPorId(Long id) {
    return ingredienteRepository.findById(id);
  }

  public void deletarIngrediente(Long id) {
    ingredienteRepository.deleteById(id);
  }
}