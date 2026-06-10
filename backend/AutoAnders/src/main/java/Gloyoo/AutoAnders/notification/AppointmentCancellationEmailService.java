package Gloyoo.AutoAnders.notification;

import Gloyoo.AutoAnders.washCalendar.dto.AppointmentCancellation;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.Locale;

@Service
public class AppointmentCancellationEmailService {

    private static final Logger log =
            LoggerFactory.getLogger(AppointmentCancellationEmailService.class);
    private static final DateTimeFormatter APPOINTMENT_FORMAT =
            DateTimeFormatter.ofPattern("EEEE, d MMMM yyyy 'at' HH:mm", Locale.ENGLISH);

    private final JavaMailSender mailSender;
    private final boolean enabled;
    private final String from;

    public AppointmentCancellationEmailService(
            JavaMailSender mailSender,
            @Value("${app.mail.enabled:false}") boolean enabled,
            @Value("${app.mail.from:}") String from
    ) {
        this.mailSender = mailSender;
        this.enabled = enabled;
        this.from = from;
    }

    public void sendCancellationConfirmation(AppointmentCancellation cancellation) {
        if (!enabled) {
            return;
        }

        String treatments = cancellation.washTypes().stream()
                .map(washType -> formatTreatment(washType.name()))
                .reduce((first, second) -> first + ", " + second)
                .orElse("");

        SimpleMailMessage message = new SimpleMailMessage();
        if (!from.isBlank()) {
            message.setFrom(from);
        }
        message.setTo(cancellation.customerEmail());
        message.setSubject("Poets Anders appointment cancelled");
        message.setText("""
                Hello %s,

                Your appointment has been cancelled successfully.

                Date and time: %s
                Treatments: %s

                %s

                Kind regards,
                Poets Anders
                """.formatted(
                        cancellation.customerName(),
                        cancellation.localDateTime().format(APPOINTMENT_FORMAT),
                        treatments,
                        cancellation.guestDeleted()
                                ? "Your temporary guest record has also been removed."
                                : "Your account remains available for future appointments."
                ));

        try {
            mailSender.send(message);
            log.info(
                    "Sent appointment cancellation email to {}",
                    cancellation.customerEmail()
            );
        } catch (MailException exception) {
            log.error(
                    "Appointment was cancelled, but cancellation email delivery to {} failed",
                    cancellation.customerEmail(),
                    exception
            );
        }
    }

    private String formatTreatment(String washType) {
        String words = washType.replace('_', ' ').toLowerCase(Locale.ENGLISH);
        return Character.toUpperCase(words.charAt(0)) + words.substring(1);
    }
}
