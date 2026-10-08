package Gloyoo.AutoAnders.Cars.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record GuestCarRequest(
        @NotBlank @Size(max = 255) String name,
        @NotBlank @Email @Size(max = 240) String email,
        @NotBlank @Size(min = 8, max = 30) String phoneNumber,
        @NotNull @Valid CarRequest car
) {
}
