package planEatsBackend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import planEatsBackend.entities.Geladeira;
import java.util.List;

public interface GeladeiraRepository extends JpaRepository<Geladeira, Long> {
  List<Geladeira> findByUsuarioId(Long usuarioId);
}