package Gloyoo.AutoAnders.washCalendar.dto;

import Gloyoo.AutoAnders.washCalendar.entity.WashType;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;
import java.util.List;

public record WashCalendarBatchRequest(
        @NotEmpty List<@NotNull WashType> washTypes,
        @NotNull LocalDateTime localDateTime
) {
}
