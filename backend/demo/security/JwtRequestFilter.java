@Component
public class JwtRequestFilter extends OncePerRequestFilter {

    @Autowired
    private TokenBlacklistService tokenBlacklistService;

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