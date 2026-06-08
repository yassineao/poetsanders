package Gloyoo.AutoAnders.user;

import Gloyoo.AutoAnders.user.entity.User;
import Gloyoo.AutoAnders.user.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

@DataJpaTest
class UserRepositoryTest {

    @Autowired
    private UserRepository userRepository;

    @Test
    void findByEmail_shouldReturnUser() {
        User user = new User();
        user.setEmail("yassine@example.com");
        user.setPassword("yassine@example.com");
        userRepository.save(user);

        Optional<User> result = userRepository.findByEmail("yassine@example.com");

        assertTrue(result.isPresent());
        assertEquals("yassine@example.com", result.get().getEmail());
    }
}