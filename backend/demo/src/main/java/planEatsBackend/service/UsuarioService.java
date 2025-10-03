package planEatsBackend.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import planEatsBackend.dto.RegisterRequest;
import planEatsBackend.entities.Usuario;
import planEatsBackend.repository.UsuarioRepository;

@Service
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
        user.setRole(req.getRole());
        return repo.save(user);
    }
}
