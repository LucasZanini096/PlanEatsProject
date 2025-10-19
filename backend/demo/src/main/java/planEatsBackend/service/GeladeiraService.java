package planEatsBackend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import planEatsBackend.dto.GeladeiraDto;
import planEatsBackend.entities.Geladeira;
import planEatsBackend.entities.Ingrediente;
import planEatsBackend.entities.Usuario;
import planEatsBackend.repository.GeladeiraRepository;
import planEatsBackend.repository.IngredienteRepository;

import java.util.List;
import java.util.Optional;

@Service
public class GeladeiraService {
  
  @Autowired
  private GeladeiraRepository geladeiraRepository;

  @Autowired
  private IngredienteRepository ingredienteRepository;

  public Geladeira adicionarIngrediente(Usuario usuario, GeladeiraDto dto) {
    Ingrediente ingrediente = ingredienteRepository.findById(dto.getIngredienteId())
        .orElseThrow(() -> new RuntimeException("Ingrediente não encontrado"));

    Geladeira geladeira = new Geladeira(usuario, ingrediente, dto.getQuantidade());
    return geladeiraRepository.save(geladeira);
  }

  public List<Geladeira> listarPorUsuario(Long usuarioId) {
    return geladeiraRepository.findByUsuarioId(usuarioId);
  }

  public Optional<Geladeira> buscarPorId(Long geladeiraId) {
    return geladeiraRepository.findById(geladeiraId);
  }

  public Geladeira incrementarQuantidade(Geladeira geladeira) {
    geladeira.setQuantidade(geladeira.getQuantidade() + 1);
    return geladeiraRepository.save(geladeira);
  }

  public Optional<Geladeira> decrementarQuantidade(Geladeira geladeira) {
    if (geladeira.getQuantidade() <= 1) {
      geladeiraRepository.delete(geladeira);
      return Optional.empty(); // Retorna vazio quando remove
    }
    
    geladeira.setQuantidade(geladeira.getQuantidade() - 1);
    return Optional.of(geladeiraRepository.save(geladeira));
  }

  public void removerIngrediente(Geladeira geladeira) {
    geladeiraRepository.delete(geladeira);
  }

  public boolean pertenceAoUsuario(Geladeira geladeira, Usuario usuario) {
    return geladeira.getUsuario().getId().equals(usuario.getId());
  }
}