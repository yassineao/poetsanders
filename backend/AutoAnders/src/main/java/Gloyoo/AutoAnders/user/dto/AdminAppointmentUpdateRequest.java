package Gloyoo.AutoAnders.user.dto;

import Gloyoo.AutoAnders.washCalendar.entity.WashType;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;
import java.util.UUID;

public record AdminAppointmentUpdateRequest(
        @NotNull UUID userId,
        @NotNull WashType washType,
        @NotNull LocalDateTime localDateTime,
        boolean accepted
) {
}
