package Gloyoo.AutoAnders.notification;

import Gloyoo.AutoAnders.user.entity.User;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;

class RegisterConfirmationServiceTest {

    @Test
    void sendsWelcomeEmailToNewlyRegisteredUser() {
        JavaMailSender mailSender = mock(JavaMailSender.class);
        RegisterConfirmationService service =
                new RegisterConfirmationService(
                        mailSender,
                        true,
                        "accounts@poetsanders.nl",
                        ""
                );
        User user = User.builder()
                .id(UUID.randomUUID())
                .name("Jane Customer")
                .email("jane@example.com")
                .build();

        service.sendRegisterConfirmation(user);

        ArgumentCaptor<SimpleMailMessage> message =
                ArgumentCaptor.forClass(SimpleMailMessage.class);
        verify(mailSender).send(message.capture());
        assertEquals("jane@example.com", message.getValue().getTo()[0]);
        assertEquals("Welcome to Poets Anders", message.getValue().getSubject());
        assertTrue(message.getValue().getText().contains("created successfully"));
    }

    @Test
    void doesNothingWhenMailIsDisabled() {
        JavaMailSender mailSender = mock(JavaMailSender.class);
        RegisterConfirmationService service =
                new RegisterConfirmationService(mailSender, false, "", "");

        service.sendRegisterConfirmation(
                User.builder().email("jane@example.com").build()
        );

        verify(mailSender, never()).send(any(SimpleMailMessage.class));
    }
}
