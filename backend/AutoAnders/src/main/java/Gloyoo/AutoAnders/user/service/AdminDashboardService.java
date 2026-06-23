package Gloyoo.AutoAnders.user.service;

import Gloyoo.AutoAnders.Cars.entity.Car;
import Gloyoo.AutoAnders.Cars.dto.CarRequest;
import Gloyoo.AutoAnders.Cars.repository.CarRepository;
import Gloyoo.AutoAnders.Cars.service.CarService;
import Gloyoo.AutoAnders.user.dto.AdminAppointmentResponse;
import Gloyoo.AutoAnders.user.dto.AdminAppointmentUpdateRequest;
import Gloyoo.AutoAnders.user.dto.AdminCarCreateRequest;
import Gloyoo.AutoAnders.user.dto.AdminDashboardResponse;
import Gloyoo.AutoAnders.user.dto.AdminUserCreateRequest;
import Gloyoo.AutoAnders.user.dto.AdminUserUpdateRequest;
import Gloyoo.AutoAnders.user.dto.AdminUserResponse;
import Gloyoo.AutoAnders.user.entity.User;
import Gloyoo.AutoAnders.user.repository.UserRepository;
import Gloyoo.AutoAnders.washCalendar.repository.WashCalendarRepository;
import Gloyoo.AutoAnders.washCalendar.entity.WashCalendar;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.UUID;

@Service
public class AdminDashboardService {

    private final UserRepository userRepository;
    private final WashCalendarRepository washCalendarRepository;
    private final PasswordEncoder passwordEncoder;
    private final CarRepository carRepository;
    private final CarService carService;

    public AdminDashboardService(
            UserRepository userRepository,
            WashCalendarRepository washCalendarRepository,
            PasswordEncoder passwordEncoder,
            CarRepository carRepository,
            CarService carService
    ) {
        this.userRepository = userRepository;
        this.washCalendarRepository = washCalendarRepository;
        this.passwordEncoder = passwordEncoder;
        this.carRepository = carRepository;
        this.carService = carService;
    }

    @Transactional(readOnly = true)
    public AdminDashboardResponse getDashboard() {
        List<AdminUserResponse> users = userRepository.findAll().stream()
                .sorted(Comparator.comparing(
                        user -> user.getCreatedAt(),
                        Comparator.nullsLast(Comparator.reverseOrder())
                ))
                .map(AdminUserResponse::from)
                .toList();

        List<AdminAppointmentResponse> appointments = washCalendarRepository.findAll().stream()
                .sorted(Comparator.comparing(
                        appointment -> appointment.getLocalDateTime(),
                        Comparator.reverseOrder()
                ))
                .map(AdminAppointmentResponse::from)
                .toList();

        long acceptedAppointments = appointments.stream()
                .filter(AdminAppointmentResponse::accepted)
                .count();

        return new AdminDashboardResponse(
                users.size(),
                appointments.size(),
                appointments.size() - acceptedAppointments,
                acceptedAppointments,
                users,
                appointments
        );
    }

    @Transactional
    public AdminUserResponse updateUser(UUID id, AdminUserUpdateRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        String email = request.email().trim().toLowerCase(Locale.ROOT);
        userRepository.findByEmailIgnoreCase(email)
                .filter(existing -> !existing.getId().equals(id))
                .ifPresent(existing -> {
                    throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already in use");
                });

        user.setName(request.name().trim());
        user.setEmail(email);
        user.setPhoneNumber(normalizeOptional(request.phoneNumber()));
        user.setRole(request.role());

        return AdminUserResponse.from(userRepository.save(user));
    }

    @Transactional
    public AdminUserResponse createUser(AdminUserCreateRequest request) {
        String email = request.email().trim().toLowerCase(Locale.ROOT);
        if (userRepository.existsByEmailIgnoreCase(email)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already in use");
        }

        User user = User.builder()
                .name(request.name().trim())
                .email(email)
                .password(passwordEncoder.encode(request.password()))
                .phoneNumber(normalizeOptional(request.phoneNumber()))
                .role(request.role())
                .build();

        return AdminUserResponse.from(userRepository.save(user));
    }

    @Transactional
    public AdminAppointmentResponse updateAppointment(
            UUID id,
            AdminAppointmentUpdateRequest request
    ) {
        WashCalendar appointment = washCalendarRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Appointment not found"));
        appointment.setWashType(request.washType());
        appointment.setLocalDateTime(request.localDateTime());
        appointment.setAccepted(request.accepted());
        return AdminAppointmentResponse.from(washCalendarRepository.save(appointment));
    }

    @Transactional
    public Car updateCar(UUID id, CarRequest request) {
        return carService.updateCar(request, id);
    }

    @Transactional
    public Car createCar(UUID adminId, AdminCarCreateRequest request) {
        User admin = userRepository.findById(adminId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Admin user not found"));
        String licensePlate = normalizeOptional(request.licensePlate());
        if (licensePlate != null && carRepository.existsByLicensePlate(licensePlate)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "License plate already in use");
        }

        Car car = Car.builder()
                .brand(request.brand().trim())
                .model(request.model().trim())
                .title(normalizeOptional(request.title()))
                .licensePlate(licensePlate)
                .yearOfManufacture(request.yearOfManufacture())
                .mileage(request.mileage())
                .price(request.price())
                .colour(normalizeOptional(request.colour()))
                .location(normalizeOptional(request.location()))
                .status(request.status())
                .user(admin)
                .build();
        return carRepository.save(car);
    }

    private String normalizeOptional(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }
}
