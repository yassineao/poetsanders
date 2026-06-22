package Gloyoo.AutoAnders.user.controller;

import Gloyoo.AutoAnders.user.dto.AdminDashboardResponse;
import Gloyoo.AutoAnders.user.dto.AdminAppointmentResponse;
import Gloyoo.AutoAnders.user.dto.AdminAppointmentUpdateRequest;
import Gloyoo.AutoAnders.user.dto.AdminCarCreateRequest;
import Gloyoo.AutoAnders.Cars.entity.Car;
import Gloyoo.AutoAnders.Cars.dto.CarRequest;
import Gloyoo.AutoAnders.user.dto.AdminUserCreateRequest;
import Gloyoo.AutoAnders.user.dto.AdminUserUpdateRequest;
import Gloyoo.AutoAnders.user.dto.AdminUserResponse;
import Gloyoo.AutoAnders.user.service.AdminDashboardService;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.util.UUID;
import java.util.Map;

@RestController
@RequestMapping("/admin")
public class AdminDashboardController {

    private final AdminDashboardService adminDashboardService;

    public AdminDashboardController(AdminDashboardService adminDashboardService) {
        this.adminDashboardService = adminDashboardService;
    }

    @GetMapping("/dashboard")
    public ResponseEntity<AdminDashboardResponse> getDashboard() {
        return ResponseEntity.ok(adminDashboardService.getDashboard());
    }

    @PatchMapping("/users/{id}")
    public ResponseEntity<AdminUserResponse> updateUser(
            @PathVariable UUID id,
            @Valid @RequestBody AdminUserUpdateRequest request
    ) {
        return ResponseEntity.ok(adminDashboardService.updateUser(id, request));
    }

    @PostMapping("/users")
    public ResponseEntity<AdminUserResponse> createUser(
            @Valid @RequestBody AdminUserCreateRequest request
    ) {
        return ResponseEntity.status(201).body(adminDashboardService.createUser(request));
    }

    @PatchMapping("/appointments/{id}")
    public ResponseEntity<AdminAppointmentResponse> updateAppointment(
            @PathVariable UUID id,
            @Valid @RequestBody AdminAppointmentUpdateRequest request
    ) {
        return ResponseEntity.ok(adminDashboardService.updateAppointment(id, request));
    }

    @PatchMapping("/cars/{id}")
    public ResponseEntity<Car> updateCar(
            @PathVariable UUID id,
            @Valid @RequestBody CarRequest request
    ) {
        return ResponseEntity.ok(adminDashboardService.updateCar(id, request));
    }

    @PostMapping("/cars")
    public ResponseEntity<Car> createCar(
            @Valid @RequestBody AdminCarCreateRequest request,
            Authentication authentication
    ) {
        return ResponseEntity.status(201).body(
                adminDashboardService.createCar(authenticatedUserId(authentication), request)
        );
    }

    private UUID authenticatedUserId(Authentication authentication) {
        if (authentication == null || !(authentication.getDetails() instanceof Map<?, ?> details)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Not authenticated");
        }
        Object uid = details.get("uid");
        if (uid == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User ID missing");
        }
        return UUID.fromString(uid.toString());
    }
}
