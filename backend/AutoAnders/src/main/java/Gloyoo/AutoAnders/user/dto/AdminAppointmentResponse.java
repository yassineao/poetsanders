package Gloyoo.AutoAnders.user.dto;

import Gloyoo.AutoAnders.washCalendar.entity.WashCalendar;
import Gloyoo.AutoAnders.washCalendar.entity.WashType;

import java.time.LocalDateTime;
import java.util.UUID;

public record AdminAppointmentResponse(
        UUID id,
        WashType washType,
        LocalDateTime localDateTime,
        boolean accepted,
        UUID userId,
        String customerName,
        String customerEmail,
        String customerPhoneNumber
) {
    public static AdminAppointmentResponse from(WashCalendar appointment) {
        return new AdminAppointmentResponse(
                appointment.getId(),
                appointment.getWashType(),
                appointment.getLocalDateTime(),
                appointment.isAccepted(),
                appointment.getUser().getId(),
                appointment.getUser().getName(),
                appointment.getUser().getEmail(),
                appointment.getUser().getPhoneNumber()
        );
    }
}
