package Gloyoo.AutoAnders.washCalendar.dto;

import Gloyoo.AutoAnders.washCalendar.entity.WashCalendar;
import Gloyoo.AutoAnders.washCalendar.entity.WashType;

import java.time.LocalDateTime;
import java.util.UUID;

public record WashCalendarResponse(
        UUID id,
        WashType washType,
        UUID userId,
        LocalDateTime localDateTime,
        boolean accepted
) {
    public static WashCalendarResponse from(WashCalendar washCalendar) {
        return new WashCalendarResponse(
                washCalendar.getId(),
                washCalendar.getWashType(),
                washCalendar.getUser().getId(),
                washCalendar.getLocalDateTime(),
                washCalendar.isAccepted()
        );
    }
}
