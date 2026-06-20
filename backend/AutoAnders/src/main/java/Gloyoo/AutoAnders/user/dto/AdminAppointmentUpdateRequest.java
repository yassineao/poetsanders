package Gloyoo.AutoAnders.user.dto;

import Gloyoo.AutoAnders.washCalendar.entity.WashType;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public record AdminAppointmentUpdateRequest(
        @NotNull WashType washType,
        @NotNull LocalDateTime localDateTime,
        boolean accepted
) {
}
