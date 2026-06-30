package Gloyoo.AutoAnders.Cars.controller;

import Gloyoo.AutoAnders.Cars.dto.CarRequest;
import Gloyoo.AutoAnders.Cars.entity.Car;
import Gloyoo.AutoAnders.Cars.entity.Status;
import Gloyoo.AutoAnders.Cars.service.CarService;
import Gloyoo.AutoAnders.notification.CarManagementEmail;
import Gloyoo.AutoAnders.user.entity.User;
import Gloyoo.AutoAnders.user.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/cars")
public class CarController {

    private final CarService carService;
    private final UserRepository userRepository;
    private final CarManagementEmail carManagementEmail;

    public CarController(
            CarService carService,
            UserRepository userRepository,
            CarManagementEmail carManagementEmail
    ) {
        this.carService = carService;
        this.userRepository = userRepository;
        this.carManagementEmail = carManagementEmail;
    }

    @PostMapping
    public ResponseEntity<Car> addCar(
            @Valid @RequestBody CarRequest carRequest,
            Authentication authentication
    ) {
        UUID userId = authenticatedUserId(authentication);
        Car savedCar = carService.addCar(carRequest, userId);

        userRepository.findById(userId)
                .ifPresent(user -> sendCarRequestConfirmation(user, savedCar));

        return ResponseEntity.status(HttpStatus.CREATED).body(savedCar);
    }

    @GetMapping
    public ResponseEntity<List<Car>> getAllCars() {
        return ResponseEntity.ok(carService.findAllCars());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Car> getCarById(@PathVariable UUID id) {
        Car car = carService.findCarById(id)
                .orElseThrow(() -> new IllegalArgumentException("Car not found"));
        return ResponseEntity.ok(car);
    }

    @GetMapping("/accepted")
    public ResponseEntity<List<Car>> getAvailableCars() {
        return ResponseEntity.ok(carService.findAvailableCars());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCar(
            @PathVariable UUID id,
            Authentication authentication
    ) {
        carService.deleteCarForUser(id, authenticatedUserId(authentication), authenticatedRole(authentication));
        return ResponseEntity.noContent().build();
    }

    @RequestMapping(value = "/{id}", method = {RequestMethod.PUT, RequestMethod.POST})
    public ResponseEntity<Car> updateCar(
            @PathVariable UUID id,
            @Valid @RequestBody CarRequest carRequest,
            Authentication authentication
    ) {
        Car savedCar = carService.updateCarForUser(
                carRequest,
                id,
                authenticatedUserId(authentication),
                authenticatedRole(authentication)
        );
        return ResponseEntity.ok(savedCar);
    }

    @RequestMapping(value = "/statusUpdate/{id}", method = {RequestMethod.PATCH, RequestMethod.POST})
    public ResponseEntity<Car> updateCarStatus(
            @PathVariable UUID id,
            @RequestBody Status status
    ) {
        if (status == null) {
            throw new IllegalArgumentException("Status cannot be null");
        }
        Car updatedCar = carService.updateCarStatus(id, status);
        return ResponseEntity.ok(updatedCar);
    }

    @GetMapping({"/ByUser", "/by_user"})
    public ResponseEntity<List<Car>> getCars(Authentication authentication) {
        List<Car> cars = carService.findCarByUser(authenticatedUserId(authentication));
        return ResponseEntity.ok(cars);
    }

    private UUID authenticatedUserId(Authentication authentication) {
        if (authentication == null || !(authentication.getDetails() instanceof Map<?, ?> details)) {
            throw new IllegalArgumentException("Not authenticated");
        }

        Object uid = details.get("uid");
        if (uid == null) {
            throw new IllegalArgumentException("User ID missing");
        }

        return UUID.fromString(uid.toString());
    }

    private String authenticatedRole(Authentication authentication) {
        if (authentication == null || !(authentication.getDetails() instanceof Map<?, ?> details)) {
            throw new IllegalArgumentException("Not authenticated");
        }
        Object role = details.get("role");
        return role == null ? "" : role.toString();
    }

    private void sendCarRequestConfirmation(User user, Car car) {
        carManagementEmail.sendCarRequestConfirmation(
                user.getName(),
                user.getEmail(),
                car
        );
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ProblemDetail> handleIllegalArgument(IllegalArgumentException exception) {
        HttpStatus status = statusFor(exception.getMessage());
        ProblemDetail problem = ProblemDetail.forStatusAndDetail(status, exception.getMessage());
        problem.setTitle(status.getReasonPhrase());
        return ResponseEntity.status(status).body(problem);
    }

    private HttpStatus statusFor(String message) {
        if (message == null) {
            return HttpStatus.BAD_REQUEST;
        }
        String normalized = message.toLowerCase();
        if (normalized.contains("not authenticated") || normalized.contains("user id missing")) {
            return HttpStatus.UNAUTHORIZED;
        }
        if (normalized.contains("only manage your own cars")) {
            return HttpStatus.FORBIDDEN;
        }
        if (normalized.contains("only admins can change car status")) {
            return HttpStatus.FORBIDDEN;
        }
        if (normalized.contains("not found")) {
            return HttpStatus.NOT_FOUND;
        }
        if (normalized.contains("already exists")) {
            return HttpStatus.CONFLICT;
        }
        return HttpStatus.BAD_REQUEST;
    }
}
