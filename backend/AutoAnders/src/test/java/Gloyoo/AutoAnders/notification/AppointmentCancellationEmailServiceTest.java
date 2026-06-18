package Gloyoo.AutoAnders.notification;

import Gloyoo.AutoAnders.washCalendar.dto.AppointmentCancellation;
import Gloyoo.AutoAnders.washCalendar.entity.WashType;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;

import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;

class AppointmentCancellationEmailServiceTest {

    @Test
    void sendsCancellationDetailsToTheCustomer() {
        JavaMailSender mailSender = mock(JavaMailSender.class);
        AppointmentCancellationEmailService service =
                new AppointmentCancellationEmailService(
                        mailSender,
                        true,
                        "appointments@poetsanders.nl",
                        ""
                );
        AppointmentCancellation cancellation = new AppointmentCancellation(
                "Guest Customer",
                "customer@example.com",
                LocalDateTime.of(2026, 6, 12, 10, 30),
                List.of(
                        WashType.Interior_Treatment,
                        WashType.Exterior_Treatment
                ),
                true
        );

        service.sendCancellationConfirmation(cancellation);

        ArgumentCaptor<SimpleMailMessage> message =
                ArgumentCaptor.forClass(SimpleMailMessage.class);
        verify(mailSender).send(message.capture());
        assertEquals("customer@example.com", message.getValue().getTo()[0]);
        assertEquals(
                "Poets Anders appointment cancelled",
                message.getValue().getSubject()
        );
        assertTrue(message.getValue().getText().contains("cancelled successfully"));
        assertTrue(message.getValue().getText().contains("guest record has also been removed"));
    }

    @Test
    void doesNothingWhenMailIsDisabled() {
        JavaMailSender mailSender = mock(JavaMailSender.class);
        AppointmentCancellationEmailService service =
                new AppointmentCancellationEmailService(mailSender, false, "","");

        service.sendCancellationConfirmation(new AppointmentCancellation(
                "Customer",
                "customer@example.com",
                LocalDateTime.of(2026, 6, 12, 10, 30),
                List.of(WashType.Total_Treatment),
                false
        ));

        verify(mailSender, never()).send(any(SimpleMailMessage.class));
    }
}
