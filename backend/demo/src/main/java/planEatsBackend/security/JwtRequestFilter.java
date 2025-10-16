package planEatsBackend.security;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import planEatsBackend.service.TokenBlacklistService;

@Component
public class JwtRequestFilter extends OncePerRequestFilter {

    @Autowired
    private TokenBlacklistService tokenBlacklistService;

    private String extractJwtFromRequest(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");

        if (authHeader == null || authHeader.isBlank()) {
            return null;
        }
        String prefix = "Bearer ";
        if (authHeader.length() > prefix.length() && authHeader.regionMatches(true, 0, prefix, 0, prefix.length())) {
        String token = authHeader.substring(prefix.length()).trim();
        return token.isEmpty() ? null : token;
        }
        String token = authHeader.trim();
        return token.isEmpty() ? null : token;
    }


    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {
        
        // (lógica para extrair o token do header)
        String jwt = extractJwtFromRequest(request);

        if (jwt != null) {
            // VERIFICAÇÃO DA BLACKLIST
            if (tokenBlacklistService.isTokenBlacklisted(jwt)) {
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Token inválido ou expirado.");
                return;
            }        }
        
        chain.doFilter(request, response);
    }
}
