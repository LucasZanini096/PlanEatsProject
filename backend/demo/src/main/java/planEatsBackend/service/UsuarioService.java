package planEatsBackend.service;

import java.util.List;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import planEatsBackend.dto.RegisterRequest;
import planEatsBackend.entities.Role;
import planEatsBackend.entities.Usuario;
import planEatsBackend.exception.ResourceNotFoundException;
import planEatsBackend.repository.UsuarioRepository;

@Service
@Transactional
public class UsuarioService {
    private final UsuarioRepository repo;
    private final PasswordEncoder encoder;

    public UsuarioService(UsuarioRepository repo, PasswordEncoder encoder) {
        this.repo = repo;
        this.encoder = encoder;
    }

    public Usuario register(RegisterRequest req) {
        if (repo.existsByEmail(req.getEmail())) {
            throw new RuntimeException("Email já cadastrado");
        }
        Usuario user = new Usuario();
        user.setNome(req.getNome());
        user.setEmail(req.getEmail());
        user.setSenhaHash(encoder.encode(req.getSenha()));
        user.setPreferenciasAlimentares(req.getPreferenciasAlimentares());
        user.setRole(req.getRole() != null ? req.getRole() : Role.USER);
        return repo.save(user);
    }

    public void deleteById(Long id) {
        if (!repo.existsById(id)) {
            throw new ResourceNotFoundException("Usuário não encontrado com id: " + id);
        }
        repo.deleteById(id);
    }

    public Usuario findById(Long id) {
        return repo.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado com id: " + id));
    }

    public List<Usuario> findAll() {
        return repo.findAll();
    }
}
