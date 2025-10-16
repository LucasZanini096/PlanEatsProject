package planEatsBackend.service;

import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

import org.springframework.beans.factory.DisposableBean;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

@Service
public class TokenBlacklistService implements InitializingBean, DisposableBean {

    private static final String BLACKLIST_PREFIX = "blacklist:";

    @Autowired(required = false)
    private StringRedisTemplate redisTemplate;

    // fallback in-memory: token -> expiry epoch millis
    private final ConcurrentHashMap<String, Long> localBlacklist = new ConcurrentHashMap<>();
    private final ScheduledExecutorService cleaner = Executors.newSingleThreadScheduledExecutor();

    /**
     * Blacklist a token por ttlMillis (milissegundos). Tenta Redis primeiro; se falhar usa memória local.
     */
    public void blacklistToken(String token, long ttlMillis) {
        if (token == null || ttlMillis <= 0) {
            // ainda assim marque por um pequeno TTL
            ttlMillis = Math.max(ttlMillis, 60_000L);
        }

        String key = BLACKLIST_PREFIX + token;
        if (redisTemplate != null) {
            try {
                redisTemplate.opsForValue().set(key, "1", ttlMillis, TimeUnit.MILLISECONDS);
                return;
            } catch (Exception e) {
                // se Redis não estiver acessível, cairá no fallback in-memory
            }
        }

        long expireAt = System.currentTimeMillis() + ttlMillis;
        localBlacklist.put(token, expireAt);
    }

    /**
     * Verifica se o token está na blacklist.
     */
    public boolean isTokenBlacklisted(String token) {
        if (token == null) return false;

        String key = BLACKLIST_PREFIX + token;
        if (redisTemplate != null) {
            try {
                Boolean has = redisTemplate.hasKey(key);
                return Boolean.TRUE.equals(has);
            } catch (Exception e) {
                // fallback para verificação em memória
            }
        }

        Long exp = localBlacklist.get(token);
        if (exp == null) return false;
        if (exp < System.currentTimeMillis()) {
            localBlacklist.remove(token);
            return false;
        }
        return true;
    }

    @Override
    public void afterPropertiesSet() {
        // limpa entradas expiradas a cada 1 minuto
        cleaner.scheduleAtFixedRate(() -> {
            long now = System.currentTimeMillis();
            localBlacklist.entrySet().removeIf(e -> e.getValue() < now);
        }, 1, 1, TimeUnit.MINUTES);
    }

    @Override
    public void destroy() {
        cleaner.shutdownNow();
    }
}