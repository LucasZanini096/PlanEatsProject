package planEatsBackend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import planEatsBackend.entities.Ingrediente;

public interface IngredienteRepository extends JpaRepository<Ingrediente, Long> {
}