package Gloyoo.AutoAnders.user.dto;

import Gloyoo.AutoAnders.Cars.entity.Status;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

import java.math.BigDecimal;

public record AdminCarUpdateRequest(
        @NotBlank String brand,
        @NotBlank String model,
        String title,
        String licensePlate,
        @PositiveOrZero Integer yearOfManufacture,
        @PositiveOrZero Integer mileage,
        @PositiveOrZero BigDecimal price,
        String colour,
        String location,
        @NotNull Status status
) {
}
