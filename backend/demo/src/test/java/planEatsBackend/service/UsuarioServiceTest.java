package planEatsBackend.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.crypto.password.PasswordEncoder;

import planEatsBackend.dto.RegisterRequest;
import planEatsBackend.entities.Usuario;
import planEatsBackend.entities.Role;
import planEatsBackend.repository.UsuarioRepository;
import planEatsBackend.exception.ResourceNotFoundException;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class UsuarioServiceTest {

    @Mock
    private UsuarioRepository usuarioRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UsuarioService usuarioService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        usuarioService = new UsuarioService(usuarioRepository, passwordEncoder);
    }

    @Test
    void registerUser_success() {
        RegisterRequest req = new RegisterRequest();
        req.setNome("Joao");
        req.setEmail("joao@example.com");
        req.setSenha("senha");
        req.setRole(Role.USER);

        when(usuarioRepository.existsByEmail(req.getEmail())).thenReturn(false);
        when(passwordEncoder.encode(any())).thenReturn("hash");
        when(usuarioRepository.save(any(Usuario.class))).thenAnswer(i -> i.getArgument(0));

        Usuario saved = usuarioService.register(req);

        assertNotNull(saved);
        assertEquals("Joao", saved.getNome());
        assertEquals("joao@example.com", saved.getEmail());
        assertEquals(Role.USER, saved.getRole());
        verify(usuarioRepository).save(any(Usuario.class));
    }

    @Test
    void registerDuplicateEmail_throws() {
        RegisterRequest req = new RegisterRequest();
        req.setEmail("dup@example.com");
        when(usuarioRepository.existsByEmail(req.getEmail())).thenReturn(true);

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () -> usuarioService.register(req));
        assertTrue(ex.getMessage().contains("Email já cadastrado"));
    }

    @Test
    void findById_notFound_throws() {
        when(usuarioRepository.findById(1L)).thenReturn(Optional.empty());
        assertThrows(ResourceNotFoundException.class, () -> usuarioService.findById(1L));
    }

    @Test
    void deleteById_notFound_throws() {
        when(usuarioRepository.existsById(99L)).thenReturn(false);
        assertThrows(ResourceNotFoundException.class, () -> usuarioService.deleteById(99L));
    }
}
