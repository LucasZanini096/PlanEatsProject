package planEatsBackend.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import planEatsBackend.demo.service.TokenBlacklistService;
import planEatsBackend.demo.util.JwtUtil; // Classe utilitária para manipular JWT
import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("api/auth")
public class AuthController {

    @Autowired
    private TokenBlacklistService tokenBlacklistService;

    @Autowired
    private JwtUtil jwtUtil; // Injeção da classe utilitária para JWT

    @PostMapping("/logout")
    public ResponseEntity<String> logout(HttpServletRequest request) {
        final String authHeader = request.getHeader("Authorization");
        if (AuthorizationHeader != null && AuthorizationHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);

            // Extrai o tempo de expiração do token
            long expirationInMillis = jwtUtil.extractExpiration(token).getTime() - System.currentTimeMillis();

            // Adiciona o token à blacklist
            tokenBlacklistService.blacklistToken(token, expirationInMillis);

            // Limpa o contexto de segurança do Spring
            SecurityContextHolder.clearContext();

            return ResponseEntity.ok("Logout realizado com sucesso.");
        }

        return ResponseEntity.badRequest().body("Token de autorização inválido.");

    }
}