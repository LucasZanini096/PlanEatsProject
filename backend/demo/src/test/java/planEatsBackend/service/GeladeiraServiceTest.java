package planEatsBackend.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import planEatsBackend.dto.IncreaseGeladeiraDto;
import planEatsBackend.entities.Geladeira;
import planEatsBackend.entities.Ingrediente;
import planEatsBackend.entities.Usuario;
import planEatsBackend.repository.GeladeiraRepository;
import planEatsBackend.repository.IngredienteRepository;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class GeladeiraServiceTest {

    @Mock
    private GeladeiraRepository geladeiraRepository;

    @Mock
    private IngredienteRepository ingredienteRepository;

    @InjectMocks
    private GeladeiraService geladeiraService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void adicionarIngrediente_success() {
        Usuario user = new Usuario();
        user.setId(1L);

        IncreaseGeladeiraDto dto = new IncreaseGeladeiraDto();
        dto.setIngredienteId(10L);
        dto.setQuantidade(2);

        Ingrediente ing = new Ingrediente();
        ing.setId(10L);
        ing.setNome("Tomate");

        when(ingredienteRepository.findById(10L)).thenReturn(Optional.of(ing));
        when(geladeiraRepository.save(any(Geladeira.class))).thenAnswer(i -> i.getArgument(0));

        Geladeira result = geladeiraService.adicionarIngrediente(user, dto);

        assertNotNull(result);
        assertEquals(2, result.getQuantidade());
        assertEquals("Tomate", result.getIngrediente().getNome());
        verify(geladeiraRepository).save(any(Geladeira.class));
    }

    @Test
    void incrementarQuantidade_savesIncremented() {
        Geladeira g = new Geladeira();
        g.setQuantidade(1);
        when(geladeiraRepository.save(any(Geladeira.class))).thenAnswer(i -> i.getArgument(0));

        Geladeira saved = geladeiraService.incrementarQuantidade(g);
        assertEquals(2, saved.getQuantidade());
        verify(geladeiraRepository).save(g);
    }

    @Test
    void decrementarQuantidade_removeWhenOne() {
        Geladeira g = new Geladeira();
        g.setQuantidade(1);

        // delete(...) é void, use doNothing() para mockar comportamento
        doNothing().when(geladeiraRepository).delete(any(Geladeira.class));

        Optional<Geladeira> maybe = geladeiraService.decrementarQuantidade(g);
        assertTrue(maybe.isEmpty());
        verify(geladeiraRepository).delete(g);
    }
}
