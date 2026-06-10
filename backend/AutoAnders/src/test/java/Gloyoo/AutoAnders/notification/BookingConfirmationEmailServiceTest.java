package Gloyoo.AutoAnders.notification;

import Gloyoo.AutoAnders.user.entity.User;
import Gloyoo.AutoAnders.washCalendar.entity.WashCalendar;
import Gloyoo.AutoAnders.washCalendar.entity.WashType;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;

class BookingConfirmationEmailServiceTest {

    @Test
    void sendsAppointmentDetailsToRegisteredUser() {
        JavaMailSender mailSender = mock(JavaMailSender.class);
        BookingConfirmationEmailService service =
                new BookingConfirmationEmailService(
                        mailSender,
                        true,
                        "appointments@poetsanders.nl"
                );
        User user = User.builder()
                .name("Jane Customer")
                .email("jane@example.com")
                .build();
        LocalDateTime appointmentTime = LocalDateTime.of(2026, 6, 12, 10, 30);
        List<WashCalendar> appointments = List.of(
                appointment(user, WashType.Interior_Treatment, appointmentTime),
                appointment(user, WashType.Exterior_Treatment, appointmentTime)
        );

        service.sendBookingConfirmation(user, appointments);

        ArgumentCaptor<SimpleMailMessage> message =
                ArgumentCaptor.forClass(SimpleMailMessage.class);
        verify(mailSender).send(message.capture());
        assertEquals("jane@example.com", message.getValue().getTo()[0]);
        assertEquals(
                "Poets Anders appointment request received",
                message.getValue().getSubject()
        );
        assertTrue(message.getValue().getText().contains("Friday, 12 June 2026 at 10:30"));
        assertTrue(message.getValue().getText().contains("Interior treatment"));
        assertTrue(message.getValue().getText().contains("Exterior treatment"));
        assertTrue(message.getValue().getText().contains("cancel-token-123"));
    }

    @Test
    void doesNothingWhenMailIsDisabled() {
        JavaMailSender mailSender = mock(JavaMailSender.class);
        BookingConfirmationEmailService service =
                new BookingConfirmationEmailService(mailSender, false, "");

        service.sendBookingConfirmation(
                User.builder().email("jane@example.com").build(),
                List.of(appointment(
                        User.builder().email("jane@example.com").build(),
                        WashType.Total_Treatment,
                        LocalDateTime.of(2026, 6, 12, 10, 30)
                ))
        );

        verify(mailSender, never()).send(org.mockito.ArgumentMatchers.any(SimpleMailMessage.class));
    }

    private WashCalendar appointment(
            User user,
            WashType washType,
            LocalDateTime appointmentTime
    ) {
        return WashCalendar.builder()
                .id(UUID.randomUUID())
                .user(user)
                .washType(washType)
                .localDateTime(appointmentTime)
                .cancellationToken("cancel-token-123")
                .build();
    }
}
