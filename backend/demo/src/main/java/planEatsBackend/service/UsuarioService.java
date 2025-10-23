package planEatsBackend.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import planEatsBackend.dto.RegisterRequest;
import planEatsBackend.entities.Admin;
import planEatsBackend.entities.Role;
import planEatsBackend.entities.Usuario;
import planEatsBackend.exception.ResourceNotFoundException;
import planEatsBackend.repository.UsuarioRepository;

@Service
@Transactional
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;;

    public UsuarioService(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public Usuario register(RegisterRequest req) {
        if (usuarioRepository.existsByEmail(req.getEmail())) {
            throw new IllegalArgumentException("Email já cadastrado");
        }

        String senhaHash = passwordEncoder.encode(req.getSenha());

        if (req.getRole() == Role.ADMIN) {
            if (req.getAdminKey() == null || req.getAdminKey().length() < 6) {
                throw new IllegalArgumentException("AdminKey necessária e com mínimo de 6 caracteres");
            }
            Admin admin = new Admin();
            admin.setNome(req.getNome());
            admin.setEmail(req.getEmail());
            admin.setSenhaHash(senhaHash);
            admin.setPreferenciasAlimentares(req.getPreferenciasAlimentares());
            admin.setRole(Role.ADMIN);
            // salvar hash da admin key
            admin.setAdminKey(passwordEncoder.encode(req.getAdminKey()));
            return usuarioRepository.save(admin);
        } else {
            Usuario user = new Usuario();
            user.setNome(req.getNome());
            user.setEmail(req.getEmail());
            user.setSenhaHash(senhaHash);
            user.setPreferenciasAlimentares(req.getPreferenciasAlimentares());
            user.setRole(Role.USER);
            return usuarioRepository.save(user);
        }
    }

    public void deleteById(Long id) {
        if (!usuarioRepository.existsById(id)) {
            throw new ResourceNotFoundException("Usuário não encontrado com id: " + id);
        }
        usuarioRepository.deleteById(id);
    }

    public Usuario findById(Long id) {
        return usuarioRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado com id: " + id));
    }

    public List<Usuario> findAll() {
        return usuarioRepository.findAll();
    }
}
