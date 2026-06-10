package Gloyoo.AutoAnders.washCalendar.dto;

import Gloyoo.AutoAnders.washCalendar.entity.WashType;

import java.time.LocalDateTime;
import java.util.List;

public record AppointmentCancellation(
        String customerName,
        String customerEmail,
        LocalDateTime localDateTime,
        List<WashType> washTypes,
        boolean guestDeleted
) {
}
