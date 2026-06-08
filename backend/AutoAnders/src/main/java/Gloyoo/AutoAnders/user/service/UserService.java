package Gloyoo.AutoAnders.user.service;

import Gloyoo.AutoAnders.Cars.entity.Car;
import Gloyoo.AutoAnders.Cars.repository.CarRepository;
import Gloyoo.AutoAnders.user.dto.UserCreateRequest;
import Gloyoo.AutoAnders.user.entity.Role;
import Gloyoo.AutoAnders.user.entity.User;
import Gloyoo.AutoAnders.user.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class UserService {

    private final UserRepository users;
    private final CarRepository cars;
    private final PasswordEncoder encoder;

    public UserService(
            UserRepository users,
            CarRepository cars,
            PasswordEncoder encoder
    ) {
        this.users = users;
        this.cars = cars;
        this.encoder = encoder;
    }

    public User register(UserCreateRequest req) {
        if (users.existsByEmail(req.getEmail())) {
            throw new IllegalArgumentException("Email already in use");
        }
        User user = User.builder()
                .name(req.getName())
                .role(Role.USER)
                .phoneNumber(req.getPhoneNumber())
                .password(encoder.encode(req.getPassword()))
                .email(req.getEmail())
                .build();

        return users.save(user);
    }

    public User findByEmailOrThrow(String email) {
        return users.findByEmail(email)
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
}