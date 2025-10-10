package planEatsBackend.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

@Service
public class TokenBlacklistService {

    private static final String BLACKLIST_PREFIX = "blacklist:";

    @Autowired
    private StringRedisTemplate redisTemplate;

    /**
     * Adiciona um token JWT à blacklist.
     * O token será armazenado no Redis com um tempo de expiração (TTL).
     * igual ao tempo de expiração original do token para otimizar o uso de memória.
     * 
     * @param token o token JWT a ser invalidado.
     * @param exirationTime o tempo de vida restante do token em milissegundos.
     */
    public void blacklistToken(String token, long exirationTime) {
        String key = BLACKLIST_PREFIX + token;
        // Armazena o token no Redis com o tempo de expiração
        redisTemplate.opsForValue().set(key, "blacklisted", exirationTime, TimeUnit.MILLISECONDS);
    }

    /**
     * Verifica se um token JWT está na blacklist.
     * 
     * @param token o token JWT a ser verificado.
     * @return true se o token estiver na blacklist, false caso contrário.
     */
    public boolean isTokenBlacklisted(String token) {
        String key = BLACKLIST_PREFIX + token;
        return redisTemplate.hasKey(key);
    }
}