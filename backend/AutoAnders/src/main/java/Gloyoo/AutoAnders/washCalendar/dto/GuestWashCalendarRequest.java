package Gloyoo.AutoAnders.washCalendar.dto;

import Gloyoo.AutoAnders.washCalendar.entity.WashType;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;
import java.util.List;

public record GuestWashCalendarRequest(
        @NotBlank @Size(max = 255) String name,
        @NotBlank @Email @Size(max = 240) String email,
        @NotBlank @Size(min = 8, max = 30) String phoneNumber,
        @NotEmpty List<@NotNull WashType> washTypes,
        @NotNull LocalDateTime localDateTime
) {
}
