package Gloyoo.AutoAnders.notification;

import Gloyoo.AutoAnders.washCalendar.dto.AppointmentCancellation;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.time.format.DateTimeFormatter;
import java.util.Locale;
import java.util.stream.Collectors;

@Service
public class AppointmentCancellationEmailService {

    private static final Logger log =
            LoggerFactory.getLogger(AppointmentCancellationEmailService.class);

    private static final DateTimeFormatter APPOINTMENT_FORMAT =
            DateTimeFormatter.ofPattern("EEEE, d MMMM yyyy 'at' HH:mm", Locale.ENGLISH);

    private static final String LOGO_PATH =
            "/logo-poets-website-1.png";

    private final JavaMailSender mailSender;
    private final boolean enabled;
    private final String from;
    private final String appBaseUrl;

    public AppointmentCancellationEmailService(
            JavaMailSender mailSender,
            @Value("${app.mail.enabled:false}") boolean enabled,
            @Value("${app.mail.from:}") String from,
            @Value("${app.base-url}") String appBaseUrl
    ) {
        this.mailSender = mailSender;
        this.enabled = enabled;
        this.from = from;
        this.appBaseUrl = removeTrailingSlash(appBaseUrl);
    }

    public void sendCancellationConfirmation(AppointmentCancellation cancellation) {
        if (!enabled) {
            return;
        }

        if (cancellation == null || cancellation.customerEmail() == null || cancellation.customerEmail().isBlank()) {
            log.warn("Skipping cancellation email because cancellation data or customer email is missing");
            return;
        }

        String customerName = safeText(cancellation.customerName(), "customer");

        String appointmentTime = cancellation.localDateTime() == null
                ? "Unknown"
                : cancellation.localDateTime().format(APPOINTMENT_FORMAT);

        String treatments = cancellation.washTypes() == null || cancellation.washTypes().isEmpty()
                ? "Not specified"
                : cancellation.washTypes().stream()
                .map(washType -> formatTreatment(washType.name()))
                .distinct()
                .collect(Collectors.joining(", "));

        String guestMessage = cancellation.guestDeleted()
                ? "Your temporary guest record has also been removed."
                : "Your account remains available for future appointments.";

        try {
            MimeMessage message = mailSender.createMimeMessage();

            MimeMessageHelper helper = new MimeMessageHelper(
                    message,
                    true,
                    StandardCharsets.UTF_8.name()
            );

            if (from != null && !from.isBlank()) {
                helper.setFrom(from);
            }

            helper.setTo(cancellation.customerEmail());
            helper.setSubject("Poets Anders appointment cancelled");

            helper.setText(
                    buildPlainTextEmail(
                            customerName,
                            appointmentTime,
                            treatments,
                            guestMessage
                    ),
                    buildHtmlEmail(
                            customerName,
                            appointmentTime,
                            treatments,
                            guestMessage
                    )
            );

            mailSender.send(message);

            log.info(
                    "Sent appointment cancellation email to {}",
                    cancellation.customerEmail()
            );

        } catch (MessagingException | MailException exception) {
            log.error(
                    "Appointment was cancelled, but cancellation email delivery to {} failed",
                    cancellation.customerEmail(),
                    exception
            );
        }
    }

    private String buildHtmlEmail(
            String customerName,
            String appointmentTime,
            String treatments,
            String guestMessage
    ) {
        String logoUrl = appBaseUrl + LOGO_PATH;

        return """
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <title>Appointment Cancelled</title>
                </head>
                <body style="margin:0; padding:0; background-color:#f5f1ec; font-family:Arial, Helvetica, sans-serif; color:#2b2b2b;">
                    <table width="100%%" cellpadding="0" cellspacing="0" style="background-color:#f5f1ec; padding:32px 0;">
                        <tr>
                            <td align="center">
                                <table width="600" cellpadding="0" cellspacing="0" style="width:600px; max-width:100%%; background-color:#ffffff; border-radius:18px; overflow:hidden; box-shadow:0 8px 28px rgba(0,0,0,0.08);">

                                    <tr>
                                        <td style="background-color:#1f1f1f; color:#ffffff; padding:32px 36px; text-align:center;">
                                            <img src="%s"
                                                 alt="Poets Anders"
                                                 width="120"
                                                 style="display:block; margin:0 auto 18px; max-width:120px; height:auto;">

                                            <h1 style="margin:0; font-size:26px; font-weight:700;">
                                                Appointment Cancelled
                                            </h1>

                                            <p style="margin:10px 0 0; font-size:15px; color:#d8d8d8;">
                                                Poets Anders
                                            </p>
                                        </td>
                                    </tr>

                                    <tr>
                                        <td style="padding:36px;">
                                            <p style="font-size:16px; margin:0 0 18px;">
                                                Hello <strong>%s</strong>,
                                            </p>

                                            <p style="font-size:16px; line-height:1.6; margin:0 0 24px;">
                                                Your appointment has been
                                                <strong style="color:#b65f5f;">cancelled successfully</strong>.
                                            </p>

                                            <table width="100%%" cellpadding="0" cellspacing="0" style="background-color:#faf7f2; border-radius:14px; padding:18px; margin:24px 0;">
                                                <tr>
                                                    <td style="padding:10px 0; font-size:14px; color:#777;">
                                                        Date and time
                                                    </td>
                                                    <td style="padding:10px 0; font-size:15px; text-align:right;">
                                                        <strong>%s</strong>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td style="padding:10px 0; font-size:14px; color:#777;">
                                                        Treatments
                                                    </td>
                                                    <td style="padding:10px 0; font-size:15px; text-align:right;">
                                                        <strong>%s</strong>
                                                    </td>
                                                </tr>
                                            </table>

                                            <p style="font-size:15px; line-height:1.6; margin:0 0 24px;">
                                                %s
                                            </p>

                                            <div style="background-color:#f8eeee; border-left:4px solid #b65f5f; padding:16px 18px; border-radius:10px; margin:28px 0;">
                                                <p style="font-size:14px; line-height:1.6; margin:0; color:#6b3b3b;">
                                                    If this cancellation was a mistake, please contact Poets Anders to make a new appointment.
                                                </p>
                                            </div>

                                            <p style="font-size:16px; line-height:1.6; margin:34px 0 0;">
                                                Kind regards,<br>
                                                <strong>Poets Anders</strong>
                                            </p>
                                        </td>
                                    </tr>

                                </table>
                            </td>
                        </tr>
                    </table>
                </body>
                </html>
                """.formatted(
                escapeHtml(logoUrl),
                escapeHtml(customerName),
                escapeHtml(appointmentTime),
                escapeHtml(treatments),
                escapeHtml(guestMessage)
        );
    }

    private String buildPlainTextEmail(
            String customerName,
            String appointmentTime,
            String treatments,
            String guestMessage
    ) {
        return """
                Hello %s,

                Your appointment has been cancelled successfully.

                Date and time: %s
                Treatments: %s

                %s

                If this cancellation was a mistake, please contact Poets Anders to make a new appointment.

                Kind regards,
                Poets Anders
                """.formatted(
                customerName,
                appointmentTime,
                treatments,
                guestMessage
        );
    }

    private String formatTreatment(String washType) {
        if (washType == null || washType.isBlank()) {
            return "Unknown";
        }

        String words = washType.replace('_', ' ').toLowerCase(Locale.ENGLISH);
        return Character.toUpperCase(words.charAt(0)) + words.substring(1);
    }

    private String safeText(String value, String fallback) {
        if (value == null || value.isBlank()) {
            return fallback;
        }

        return value;
    }

    private String escapeHtml(String value) {
        if (value == null) {
            return "";
        }

        return value
                .replace("&", "&amp;")
                .replace("<", "&lt;")
                .replace(">", "&gt;")
                .replace("\"", "&quot;")
                .replace("'", "&#39;");
    }

    private String removeTrailingSlash(String value) {
        if (value == null || value.isBlank()) {
            return "";
        }

        while (value.endsWith("/")) {
            value = value.substring(0, value.length() - 1);
        }

        return value;
    }
}