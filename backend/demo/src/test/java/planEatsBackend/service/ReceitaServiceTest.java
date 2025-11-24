package planEatsBackend.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import planEatsBackend.dto.ReceitaRequestDto;
import planEatsBackend.dto.ReceitaResponseDto;
import planEatsBackend.entities.Geladeira;
import planEatsBackend.entities.Ingrediente;
import planEatsBackend.entities.Receita;
import planEatsBackend.entities.Usuario;
import planEatsBackend.repository.GeladeiraRepository;
import planEatsBackend.repository.ReceitaRepository;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class ReceitaServiceTest {

    @Mock
    private ReceitaRepository receitaRepository;

    @Mock
    private GeladeiraRepository geladeiraRepository;

    @Mock
    private GeminiService geminiService;

    @InjectMocks
    private ReceitaService receitaService;

    private ObjectMapper mapper = new ObjectMapper();

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void gerarReceita_success() {
        Usuario u = new Usuario();
        u.setId(5L);

        ReceitaRequestDto req = new ReceitaRequestDto();
        req.setIngredientesIds(List.of(100L));
        req.setComentario("sem sal");

        Ingrediente ing = new Ingrediente();
        ing.setId(200L);
        ing.setNome("Queijo");

        Geladeira g = new Geladeira();
        g.setId(100L);
        g.setIngrediente(ing);

        when(geladeiraRepository.findById(100L)).thenReturn(Optional.of(g));

        ObjectNode node = mapper.createObjectNode();
        node.put("nome", "Tostada de Queijo");
        node.put("descricao", "Deliciosa");
        node.put("modoPreparo", "Frite");
        node.put("tempoPreparo", 10);
        node.put("custoAproximado", 5.5);

        when(geminiService.gerarReceita(any(), any())).thenReturn(node);
        when(receitaRepository.save(any(Receita.class))).thenAnswer(i -> {
            Receita r = i.getArgument(0);
            r.setId(77L);
            return r;
        });

        ReceitaResponseDto dto = receitaService.gerarReceita(u, req);

        assertNotNull(dto);
        assertEquals(77L, dto.getId());
        assertEquals("Tostada de Queijo", dto.getNome());
        assertTrue(dto.getIngredientes().contains("Queijo"));
        verify(receitaRepository).save(any(Receita.class));
    }
}
