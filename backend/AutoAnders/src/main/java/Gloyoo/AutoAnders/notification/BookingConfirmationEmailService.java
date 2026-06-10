package Gloyoo.AutoAnders.notification;

import Gloyoo.AutoAnders.user.entity.User;
import Gloyoo.AutoAnders.washCalendar.entity.WashCalendar;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Locale;

@Service
public class BookingConfirmationEmailService {

    private static final Logger log =
            LoggerFactory.getLogger(BookingConfirmationEmailService.class);
    private static final DateTimeFormatter APPOINTMENT_FORMAT =
            DateTimeFormatter.ofPattern("EEEE, d MMMM yyyy 'at' HH:mm", Locale.ENGLISH);

    private final JavaMailSender mailSender;
    private final boolean enabled;
    private final String from;

    public BookingConfirmationEmailService(
            JavaMailSender mailSender,
            @Value("${app.mail.enabled:false}") boolean enabled,
            @Value("${app.mail.from:}") String from
    ) {
        this.mailSender = mailSender;
        this.enabled = enabled;
        this.from = from;
    }

    public void sendBookingConfirmation(User user, List<WashCalendar> appointments) {
        if (!enabled || appointments.isEmpty()) {
            return;
        }

        String treatments = appointments.stream()
                .map(appointment -> formatTreatment(appointment.getWashType().name()))
                .distinct()
                .reduce((first, second) -> first + ", " + second)
                .orElse("");
        String appointmentTime = appointments.getFirst()
                .getLocalDateTime()
                .format(APPOINTMENT_FORMAT);
        String cancellationToken = appointments.getFirst().getCancellationToken();

        SimpleMailMessage message = new SimpleMailMessage();
        if (!from.isBlank()) {
            message.setFrom(from);
        }
        message.setTo(user.getEmail());
        message.setSubject("Poets Anders appointment request received");
        message.setText("""
                Hello %s,

                We received your appointment request.

                Date and time: %s
                Treatments: %s

                Your request is currently pending. You can log in to view its status.

                Cancellation token: %s
                Keep this token private. It can cancel every treatment in this appointment.

                Kind regards,
                Poets Anders
                """.formatted(
                        user.getName(),
                        appointmentTime,
                        treatments,
                        cancellationToken
                ));

        try {
            mailSender.send(message);
        } catch (MailException exception) {
            log.error(
                    "Appointment {} was saved, but confirmation email delivery to {} failed",
                    appointments.getFirst().getId(),
                    user.getEmail(),
                    exception
            );
        }
    }

    private String formatTreatment(String washType) {
        String words = washType.replace('_', ' ').toLowerCase(Locale.ENGLISH);
        return Character.toUpperCase(words.charAt(0)) + words.substring(1);
    }
}
