package planEatsBackend.controller;

import java.util.Map;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;

import planEatsBackend.dto.RegisterRequest;
import planEatsBackend.dto.UsuarioDto;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import planEatsBackend.dto.LoginRequest;
import planEatsBackend.entities.Admin;
import planEatsBackend.entities.Role;
import planEatsBackend.entities.Usuario;
import planEatsBackend.mapper.UsuarioMapper;
import planEatsBackend.repository.UsuarioRepository;
import planEatsBackend.security.JwtUtil; // ADICIONADO
import planEatsBackend.service.TokenBlacklistService;
import planEatsBackend.service.UsuarioService;

import org.springframework.security.access.prepost.PreAuthorize;


@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private TokenBlacklistService tokenBlacklistService;

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        var auth = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getSenha())
        );
        SecurityContextHolder.getContext().setAuthentication(auth);

        // buscar o usuário (para verificar adminKey se for Admin)
        Usuario usuario = usuarioRepository.findByEmail(loginRequest.getEmail())
            .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado"));

        if (usuario.getRole() == Role.ADMIN) {
            // verifica adminKey enviada no request contra o hash armazenado
            if (!(usuario instanceof Admin)) {
                return ResponseEntity.status(403).body(Map.of("error", "Conta não é admin"));
            }
            Admin admin = (Admin) usuario;
            if (loginRequest.getAdminKey() == null || !passwordEncoder.matches(loginRequest.getAdminKey(), admin.getAdminKey())) {
                return ResponseEntity.status(401).body(Map.of("error", "Admin key inválida"));
            }
        }

        String jwt = jwtUtil.generateToken(auth.getName());
        return ResponseEntity.ok(Map.of("token", jwt, "type", "Bearer"));
    }

    @GetMapping("/is-admin")
    public ResponseEntity<Map<String, Boolean>> isAdmin(Authentication authentication) {
        boolean isAdmin = false;
        if (authentication != null && authentication.isAuthenticated()) {
            isAdmin = authentication.getAuthorities()
                    .stream()
                    .anyMatch(a -> "ROLE_ADMIN".equals(a.getAuthority()));
        }
        return ResponseEntity.ok(Map.of("isAdmin", isAdmin));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request) {
        String token = extractJwtFromRequest(request);
        if (token == null) {
            return ResponseEntity.badRequest().body("Header Authorization ausente ou mal formatado");
        }

        try {
            // pega data de expiração do token e calcula TTL restante em ms
            java.util.Date exp = jwtUtil.extractExpiration(token);
            long ttl = exp.getTime() - System.currentTimeMillis();

            if (ttl <= 0) {
                // token já expirado — ainda podemos colocar um TTL curto na blacklist
                tokenBlacklistService.blacklistToken(token, 60_000L); // 1 minuto
            } else {
                tokenBlacklistService.blacklistToken(token, ttl);
            }
        } catch (io.jsonwebtoken.JwtException | IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Token inválido: " + e.getMessage());
        }

        SecurityContextHolder.clearContext();
        return ResponseEntity.ok("Logout realizado com sucesso.");
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequest req) {
        try {
            var saved = usuarioService.register(req);
            // retorna DTO mapeado sem senha
            return ResponseEntity.status(201).body(UsuarioMapper.toDto(saved));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/myinfo")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<UsuarioDto> obterUsuarioAutenticado() {
        Usuario usuario = usuarioRepository.findByEmail(SecurityContextHolder.getContext().getAuthentication().getName())
            .orElseThrow(() -> new RuntimeException("Usuário autenticado não encontrado"));
        return ResponseEntity.ok(UsuarioMapper.toDto(usuario));
    }

    private String extractJwtFromRequest(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || authHeader.isBlank()) return null;

        String prefix = "Bearer ";
        if (authHeader.length() > prefix.length() &&
            authHeader.regionMatches(true, 0, prefix, 0, prefix.length())) {
            String token = authHeader.substring(prefix.length()).trim();
            return token.isEmpty() ? null : token;
        }

        String token = authHeader.trim();
        return token.isEmpty() ? null : token;
    }
}