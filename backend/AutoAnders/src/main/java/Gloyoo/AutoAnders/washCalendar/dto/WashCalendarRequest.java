package Gloyoo.AutoAnders.washCalendar.dto;

import Gloyoo.AutoAnders.washCalendar.entity.WashType;

import java.time.LocalDateTime;

public record WashCalendarRequest(
        WashType washType,
        LocalDateTime localDateTime
) {
}
