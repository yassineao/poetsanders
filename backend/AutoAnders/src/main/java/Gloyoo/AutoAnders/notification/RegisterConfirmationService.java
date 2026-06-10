package Gloyoo.AutoAnders.notification;

import Gloyoo.AutoAnders.user.entity.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class RegisterConfirmationService {

    private static final Logger log =
            LoggerFactory.getLogger(RegisterConfirmationService.class);

    private final JavaMailSender mailSender;
    private final boolean enabled;
    private final String from;

    public RegisterConfirmationService(
            JavaMailSender mailSender,
            @Value("${app.mail.enabled:false}") boolean enabled,
            @Value("${app.mail.from:}") String from
    ) {
        this.mailSender = mailSender;
        this.enabled = enabled;
        this.from = from;
    }

    public void sendRegisterConfirmation(User user) {
        if (!enabled) {
            return;
        }

        SimpleMailMessage message = new SimpleMailMessage();
        if (!from.isBlank()) {
            message.setFrom(from);
        }
        message.setTo(user.getEmail());
        message.setSubject("Welcome to Poets Anders");
        message.setText("""
                Hello %s,

                Your account has been created successfully.

                Email: %s

                You can now book appointments, view their status, and manage them online.

                Kind regards,
                Poets Anders
                """.formatted(user.getName(), user.getEmail()));

        try {
            mailSender.send(message);
        } catch (MailException exception) {
            log.error(
                    "User {} was saved, but confirmation email delivery to {} failed",
                    user.getId(),
                    user.getEmail(),
                    exception
            );
        }
    }
}
