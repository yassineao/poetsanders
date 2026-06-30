package Gloyoo.AutoAnders.user.repository;

import Gloyoo.AutoAnders.user.entity.ProfileAccessToken;
import Gloyoo.AutoAnders.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface ProfileAccessTokenRepository extends JpaRepository<ProfileAccessToken, UUID> {
    Optional<ProfileAccessToken> findByTokenHash(String tokenHash);

    void deleteByUserAndUsedAtIsNull(User user);
}
