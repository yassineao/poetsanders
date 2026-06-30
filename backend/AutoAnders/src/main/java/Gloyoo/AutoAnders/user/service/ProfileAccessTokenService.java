package Gloyoo.AutoAnders.user.service;

import Gloyoo.AutoAnders.user.entity.ProfileAccessToken;
import Gloyoo.AutoAnders.user.entity.User;
import Gloyoo.AutoAnders.user.repository.ProfileAccessTokenRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.Duration;
import java.time.Instant;
import java.util.Base64;

@Service
public class ProfileAccessTokenService {

    private static final SecureRandom SECURE_RANDOM = new SecureRandom();

    private final ProfileAccessTokenRepository tokens;
    private final Duration tokenTtl;

    public ProfileAccessTokenService(
            ProfileAccessTokenRepository tokens,
            @Value("${app.profile-access-token.ttl:PT48H}") Duration tokenTtl
    ) {
        this.tokens = tokens;
        this.tokenTtl = tokenTtl;
    }

    @Transactional
    public String createToken(User user) {
        tokens.deleteByUserAndUsedAtIsNull(user);

        String token = generateToken();
        tokens.save(ProfileAccessToken.builder()
                .user(user)
                .tokenHash(hashToken(token))
                .expiresAt(Instant.now().plus(tokenTtl))
                .build());

        return token;
    }

    @Transactional
    public User consumeToken(String rawToken) {
        if (rawToken == null || rawToken.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Profile access token is required");
        }

        ProfileAccessToken token = tokens.findByTokenHash(hashToken(rawToken))
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Profile access token is invalid or already used"
                ));

        if (token.getUsedAt() != null) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Profile access token is invalid or already used"
            );
        }

        if (token.getExpiresAt().isBefore(Instant.now())) {
            throw new ResponseStatusException(
                    HttpStatus.GONE,
                    "Profile access token has expired"
            );
        }

        token.setUsedAt(Instant.now());
        return token.getUser();
    }

    private String generateToken() {
        byte[] tokenBytes = new byte[32];
        SECURE_RANDOM.nextBytes(tokenBytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(tokenBytes);
    }

    private String hashToken(String token) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(token.getBytes(StandardCharsets.UTF_8));
            return java.util.HexFormat.of().formatHex(hash);
        } catch (NoSuchAlgorithmException exception) {
            throw new IllegalStateException("SHA-256 is not available", exception);
        }
    }
}
