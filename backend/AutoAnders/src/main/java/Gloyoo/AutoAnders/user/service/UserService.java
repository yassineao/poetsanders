package Gloyoo.AutoAnders.user.service;

import Gloyoo.AutoAnders.Cars.entity.Car;
import Gloyoo.AutoAnders.Cars.repository.CarRepository;
import Gloyoo.AutoAnders.user.dto.UserCreateRequest;
import Gloyoo.AutoAnders.user.dto.UserUpdateRequest;
import Gloyoo.AutoAnders.user.entity.Role;
import Gloyoo.AutoAnders.user.entity.User;
import Gloyoo.AutoAnders.user.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Locale;
import java.util.UUID;

@Service
public class UserService {

    private final UserRepository users;
    private final CarRepository cars;
    private final PasswordEncoder encoder;
    private final String guestEmailPrefix;

    public UserService(
            UserRepository users,
            CarRepository cars,
            PasswordEncoder encoder,
            @Value("${guest.email-prefix}") String guestEmailPrefix
    ) {
        this.users = users;
        this.cars = cars;
        this.encoder = encoder;
        this.guestEmailPrefix = guestEmailPrefix;
    }

    @Transactional
    public User register(UserCreateRequest req) {
        String normalizedEmail = normalizeEmail(req.getEmail());
        if (users.existsByEmailIgnoreCase(normalizedEmail)) {
            throw new IllegalArgumentException("Email already in use");
        }

        String guestEmail = guestEmailPrefix + normalizedEmail;
        User existingGuest = users.findByEmail(guestEmail).orElse(null);
        if (existingGuest != null) {
            existingGuest.setEmail(normalizedEmail);
            existingGuest.setName(req.getName().trim());
            existingGuest.setPhoneNumber(req.getPhoneNumber().trim());
            existingGuest.setPassword(encoder.encode(req.getPassword()));
            existingGuest.setRole(Role.USER);
            return users.save(existingGuest);
        }

        User user = User.builder()
                .name(req.getName().trim())
                .role(Role.USER)
                .phoneNumber(req.getPhoneNumber().trim())
                .password(encoder.encode(req.getPassword()))
                .email(normalizedEmail)
                .build();

        return users.save(user);
    }

    public User findByEmailOrThrow(String email) {
        return users.findByEmailIgnoreCase(normalizeEmail(email))
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }

    public User findByIdOrThrow(UUID id) {
        return users.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }

    public List<Car> findAllCarsByUserId(UUID userId) {
        if (!users.existsById(userId)) {
            throw new IllegalArgumentException("User not found");
        }

        return cars.findByUserId(userId);
    }

    public boolean checkPassword(User user, String rawPassword) {
        return encoder.matches(rawPassword, user.getPassword());
    }
      public User update(UUID uuid, UserUpdateRequest req) {
        User user = this.findByIdOrThrow(uuid);

        if (req.getName() != null && !req.getName().isBlank()) {
            user.setName(req.getName().trim());
        }

        if (req.getPhoneNumber() != null && !req.getPhoneNumber().isBlank()) {
            user.setPhoneNumber(req.getPhoneNumber().trim());
        }

        if (req.getPassword() != null && !req.getPassword().isBlank()) {
            user.setPassword(encoder.encode(req.getPassword()));
        }

        return users.save(user);
    }

    public User registerGuest(String name, String email, String phoneNumber) {
        String normalizedEmail = normalizeEmail(email);
        String guestEmail = guestEmailPrefix + normalizedEmail;

        if (guestEmail.length() > 255) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Guest email prefix and email address exceed the storage limit"
            );
        }

        if (users.existsByEmail(guestEmail)) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "This email address has already been used for a guest appointment"
            );
        }

        User guest = User.builder()
                .name(name.trim())
                .role(Role.USER)
                .phoneNumber(phoneNumber.trim())
                .password(encoder.encode(UUID.randomUUID() + "Aa1!"))
                .email(guestEmail)
                .build();

        return users.save(guest);
    }

    public boolean isGuest(User user) {
        return user.getEmail() != null && user.getEmail().startsWith(guestEmailPrefix);
    }

    public String contactEmail(User user) {
        if (isGuest(user)) {
            return user.getEmail().substring(guestEmailPrefix.length());
        }
        return user.getEmail();
    }

    public void deleteGuest(User user) {
        if (!isGuest(user)) {
            throw new IllegalArgumentException("Only guest users can be deleted automatically");
        }
        users.delete(user);
    }

    private String normalizeEmail(String email) {
        return email.trim().toLowerCase(Locale.ROOT);
    }
}
