package Gloyoo.AutoAnders.notification;

import Gloyoo.AutoAnders.Cars.entity.Car;
import Gloyoo.AutoAnders.Cars.entity.Status;
import Gloyoo.AutoAnders.user.entity.User;
import Gloyoo.AutoAnders.washCalendar.entity.WashCalendar;
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

@Service
public class StatusChangeEmailService {

    private static final Logger log =
            LoggerFactory.getLogger(StatusChangeEmailService.class);

    private static final DateTimeFormatter APPOINTMENT_FORMAT =
            DateTimeFormatter.ofPattern("EEEE, d MMMM yyyy 'at' HH:mm", Locale.ENGLISH);

    private final JavaMailSender mailSender;
    private final boolean enabled;
    private final String from;
    private final String appBaseUrl;
    private final String guestEmailPrefix;

    public StatusChangeEmailService(
            JavaMailSender mailSender,
            @Value("${app.mail.enabled:false}") boolean enabled,
            @Value("${app.mail.from:}") String from,
            @Value("${app.base-url:http://localhost:8080}") String appBaseUrl,
            @Value("${guest.email-prefix:guest::}") String guestEmailPrefix
    ) {
        this.mailSender = mailSender;
        this.enabled = enabled;
        this.from = from;
        this.appBaseUrl = removeTrailingSlash(appBaseUrl);
        this.guestEmailPrefix = guestEmailPrefix;
    }

    public void sendCarStatusChanged(Car car, Status previousStatus, Status newStatus) {
        if (!enabled || car == null || previousStatus == newStatus) {
            return;
        }

        User user = car.getUser();
        if (user == null || contactEmail(user).isBlank()) {
            log.warn("Skipping car status email for car {} because customer email is missing", car.getId());
            return;
        }

        String customerName = safeText(user.getName(), "customer");
        String customerEmail = contactEmail(user);
        String vehicle = formatVehicle(car);
        String previous = formatStatus(previousStatus);
        String current = formatStatus(newStatus);

        sendStatusEmail(
                customerEmail,
                "AutoAnders car status updated",
                buildPlainTextCarEmail(customerName, vehicle, previous, current),
                buildHtmlCarEmail(customerName, vehicle, previous, current)
        );

        log.info("Sent car status change email for car {} to {}", car.getId(), customerEmail);
    }

    public void sendAppointmentStatusChanged(
            WashCalendar appointment,
            boolean previousAccepted,
            boolean newAccepted
    ) {
        if (!enabled || appointment == null || previousAccepted == newAccepted) {
            return;
        }

        User user = appointment.getUser();
        if (user == null || contactEmail(user).isBlank()) {
            log.warn(
                    "Skipping appointment status email for appointment {} because customer email is missing",
                    appointment.getId()
            );
            return;
        }

        String customerName = safeText(user.getName(), "customer");
        String customerEmail = contactEmail(user);
        String previous = formatAppointmentStatus(previousAccepted);
        String current = formatAppointmentStatus(newAccepted);
        String appointmentTime = appointment.getLocalDateTime() == null
                ? "Unknown"
                : appointment.getLocalDateTime().format(APPOINTMENT_FORMAT);
        String treatment = appointment.getWashType() == null
                ? "Not specified"
                : formatWords(appointment.getWashType().name());

        sendStatusEmail(
                customerEmail,
                "Poets Anders appointment status updated",
                buildPlainTextAppointmentEmail(customerName, appointmentTime, treatment, previous, current),
                buildHtmlAppointmentEmail(customerName, appointmentTime, treatment, previous, current)
        );

        log.info(
                "Sent appointment status change email for appointment {} to {}",
                appointment.getId(),
                customerEmail
        );
    }

    public void sendCarUpdated(Car car) {
        if (!enabled || car == null) {
            return;
        }

        User user = car.getUser();
        if (user == null || contactEmail(user).isBlank()) {
            log.warn("Skipping car update email for car {} because customer email is missing", car.getId());
            return;
        }

        String customerName = safeText(user.getName(), "customer");
        String customerEmail = contactEmail(user);
        String vehicle = formatVehicle(car);

        sendStatusEmail(
                customerEmail,
                "AutoAnders car updated",
                buildPlainTextChangeEmail(
                        customerName,
                        "Your car details were updated.",
                        "Vehicle: " + vehicle,
                        appBaseUrl + "/account",
                        "AutoAnders"
                ),
                buildHtmlChangeEmail(
                        "Your car details were updated",
                        customerName,
                        "Vehicle",
                        vehicle,
                        appBaseUrl + "/account",
                        "View Account",
                        "AutoAnders"
                )
        );
    }

    public void sendCarDeleted(Car car) {
        if (!enabled || car == null) {
            return;
        }

        User user = car.getUser();
        if (user == null || contactEmail(user).isBlank()) {
            log.warn("Skipping car deletion email for car {} because customer email is missing", car.getId());
            return;
        }

        String customerName = safeText(user.getName(), "customer");
        String customerEmail = contactEmail(user);
        String vehicle = formatVehicle(car);

        sendStatusEmail(
                customerEmail,
                "AutoAnders car deleted",
                buildPlainTextChangeEmail(
                        customerName,
                        "Your car was deleted from AutoAnders.",
                        "Vehicle: " + vehicle,
                        appBaseUrl + "/account",
                        "AutoAnders"
                ),
                buildHtmlChangeEmail(
                        "Your car was deleted",
                        customerName,
                        "Vehicle",
                        vehicle,
                        appBaseUrl + "/account",
                        "View Account",
                        "AutoAnders"
                )
        );
    }

    public void sendAppointmentUpdated(WashCalendar appointment) {
        if (!enabled || appointment == null) {
            return;
        }

        User user = appointment.getUser();
        if (user == null || contactEmail(user).isBlank()) {
            log.warn(
                    "Skipping appointment update email for appointment {} because customer email is missing",
                    appointment.getId()
            );
            return;
        }

        String customerName = safeText(user.getName(), "customer");
        String customerEmail = contactEmail(user);
        String appointmentTime = appointment.getLocalDateTime() == null
                ? "Unknown"
                : appointment.getLocalDateTime().format(APPOINTMENT_FORMAT);
        String treatment = appointment.getWashType() == null
                ? "Not specified"
                : formatWords(appointment.getWashType().name());

        sendStatusEmail(
                customerEmail,
                "Poets Anders appointment updated",
                buildPlainTextChangeEmail(
                        customerName,
                        "Your appointment details were updated.",
                        "Appointment: " + appointmentTime + "\nTreatment: " + treatment,
                        appBaseUrl + "/appointments",
                        "Poets Anders"
                ),
                buildHtmlChangeEmail(
                        "Your appointment details were updated",
                        customerName,
                        "Appointment",
                        appointmentTime + " - " + treatment,
                        appBaseUrl + "/appointments",
                        "View Appointments",
                        "Poets Anders"
                )
        );
    }

    private void sendStatusEmail(
            String to,
            String subject,
            String plainText,
            String html
    ) {
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

            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(plainText, html);

            mailSender.send(message);
        } catch (MessagingException | MailException exception) {
            log.error("Status changed, but status email delivery to {} failed: {}", to, exception.getMessage());
        }
    }

    private String buildHtmlCarEmail(
            String customerName,
            String vehicle,
            String previousStatus,
            String currentStatus
    ) {
        return buildHtmlEmail(
                "Your car status was updated",
                customerName,
                "Vehicle",
                vehicle,
                previousStatus,
                currentStatus,
                appBaseUrl + "/account",
                "View Account",
                "AutoAnders"
        );
    }

    private String buildHtmlAppointmentEmail(
            String customerName,
            String appointmentTime,
            String treatment,
            String previousStatus,
            String currentStatus
    ) {
        return buildHtmlEmail(
                "Your appointment status was updated",
                customerName,
                "Appointment",
                appointmentTime + " - " + treatment,
                previousStatus,
                currentStatus,
                appBaseUrl + "/appointments",
                "View Appointments",
                "Poets Anders"
        );
    }

    private String buildHtmlEmail(
            String heading,
            String customerName,
            String detailLabel,
            String detailValue,
            String previousStatus,
            String currentStatus,
            String actionUrl,
            String actionLabel,
            String signOff
    ) {
        return """
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <title>Status Updated</title>
                </head>
                <body style="margin:0; padding:0; background-color:#f5f1ec; font-family:Arial, Helvetica, sans-serif; color:#2b2b2b;">
                    <table width="100%%" cellpadding="0" cellspacing="0" style="background-color:#f5f1ec; padding:32px 0;">
                        <tr>
                            <td align="center">
                                <table width="600" cellpadding="0" cellspacing="0" style="width:600px; max-width:100%%; background-color:#ffffff; border-radius:18px; overflow:hidden; box-shadow:0 8px 28px rgba(0,0,0,0.08);">
                                    <tr>
                                        <td style="background-color:#1f1f1f; color:#ffffff; padding:32px 36px; text-align:center;">
                                            <h1 style="margin:0; font-size:26px; font-weight:700;">%s</h1>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding:36px;">
                                            <p style="font-size:16px; margin:0 0 18px;">Hello <strong>%s</strong>,</p>
                                            <p style="font-size:16px; line-height:1.6; margin:0 0 24px;">
                                                The status has changed from <strong>%s</strong> to <strong>%s</strong>.
                                            </p>
                                            <table width="100%%" cellpadding="0" cellspacing="0" style="background-color:#faf7f2; border-radius:14px; padding:18px; margin:24px 0;">
                                                <tr>
                                                    <td style="padding:10px 0; font-size:14px; color:#777;">%s</td>
                                                    <td style="padding:10px 0; font-size:15px; text-align:right;"><strong>%s</strong></td>
                                                </tr>
                                                <tr>
                                                    <td style="padding:10px 0; font-size:14px; color:#777;">New status</td>
                                                    <td style="padding:10px 0; font-size:15px; text-align:right;"><strong>%s</strong></td>
                                                </tr>
                                            </table>
                                            <div style="text-align:center; margin:34px 0;">
                                                <a href="%s" style="background-color:#1f1f1f; color:#ffffff; text-decoration:none; padding:15px 30px; border-radius:999px; font-size:16px; font-weight:700; display:inline-block;">%s</a>
                                            </div>
                                            <p style="font-size:16px; line-height:1.6; margin:34px 0 0;">
                                                Kind regards,<br>
                                                <strong>%s</strong>
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
                escapeHtml(heading),
                escapeHtml(customerName),
                escapeHtml(previousStatus),
                escapeHtml(currentStatus),
                escapeHtml(detailLabel),
                escapeHtml(detailValue),
                escapeHtml(currentStatus),
                escapeHtml(actionUrl),
                escapeHtml(actionLabel),
                escapeHtml(signOff)
        );
    }

    private String buildPlainTextCarEmail(
            String customerName,
            String vehicle,
            String previousStatus,
            String currentStatus
    ) {
        return """
                Hello %s,

                Your car status was updated.

                Vehicle: %s
                Previous status: %s
                New status: %s

                View your account:
                %s/account

                Kind regards,
                AutoAnders
                """.formatted(customerName, vehicle, previousStatus, currentStatus, appBaseUrl);
    }

    private String buildPlainTextAppointmentEmail(
            String customerName,
            String appointmentTime,
            String treatment,
            String previousStatus,
            String currentStatus
    ) {
        return """
                Hello %s,

                Your appointment status was updated.

                Appointment: %s
                Treatment: %s
                Previous status: %s
                New status: %s

                View your appointments:
                %s/appointments

                Kind regards,
                Poets Anders
                """.formatted(customerName, appointmentTime, treatment, previousStatus, currentStatus, appBaseUrl);
    }

    private String buildHtmlChangeEmail(
            String heading,
            String customerName,
            String detailLabel,
            String detailValue,
            String actionUrl,
            String actionLabel,
            String signOff
    ) {
        return """
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <title>Confirmation</title>
                </head>
                <body style="margin:0; padding:0; background-color:#f5f1ec; font-family:Arial, Helvetica, sans-serif; color:#2b2b2b;">
                    <table width="100%%" cellpadding="0" cellspacing="0" style="background-color:#f5f1ec; padding:32px 0;">
                        <tr>
                            <td align="center">
                                <table width="600" cellpadding="0" cellspacing="0" style="width:600px; max-width:100%%; background-color:#ffffff; border-radius:18px; overflow:hidden; box-shadow:0 8px 28px rgba(0,0,0,0.08);">
                                    <tr>
                                        <td style="background-color:#1f1f1f; color:#ffffff; padding:32px 36px; text-align:center;">
                                            <h1 style="margin:0; font-size:26px; font-weight:700;">%s</h1>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding:36px;">
                                            <p style="font-size:16px; margin:0 0 18px;">Hello <strong>%s</strong>,</p>
                                            <p style="font-size:16px; line-height:1.6; margin:0 0 24px;">
                                                This is a confirmation from us.
                                            </p>
                                            <table width="100%%" cellpadding="0" cellspacing="0" style="background-color:#faf7f2; border-radius:14px; padding:18px; margin:24px 0;">
                                                <tr>
                                                    <td style="padding:10px 0; font-size:14px; color:#777;">%s</td>
                                                    <td style="padding:10px 0; font-size:15px; text-align:right;"><strong>%s</strong></td>
                                                </tr>
                                            </table>
                                            <div style="text-align:center; margin:34px 0;">
                                                <a href="%s" style="background-color:#1f1f1f; color:#ffffff; text-decoration:none; padding:15px 30px; border-radius:999px; font-size:16px; font-weight:700; display:inline-block;">%s</a>
                                            </div>
                                            <p style="font-size:16px; line-height:1.6; margin:34px 0 0;">
                                                Kind regards,<br>
                                                <strong>%s</strong>
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
                escapeHtml(heading),
                escapeHtml(customerName),
                escapeHtml(detailLabel),
                escapeHtml(detailValue),
                escapeHtml(actionUrl),
                escapeHtml(actionLabel),
                escapeHtml(signOff)
        );
    }

    private String buildPlainTextChangeEmail(
            String customerName,
            String message,
            String details,
            String actionUrl,
            String signOff
    ) {
        return """
                Hello %s,

                %s

                %s

                View it here:
                %s

                Kind regards,
                %s
                """.formatted(customerName, message, details, actionUrl, signOff);
    }

    private String contactEmail(User user) {
        String email = user.getEmail();
        if (email == null) {
            return "";
        }

        if (guestEmailPrefix != null && !guestEmailPrefix.isBlank() && email.startsWith(guestEmailPrefix)) {
            return email.substring(guestEmailPrefix.length()).trim();
        }

        return email.trim();
    }

    private String formatVehicle(Car car) {
        String brand = safeText(car.getBrand(), "");
        String model = safeText(car.getModel(), "");
        String year = car.getYearOfManufacture() == null ? "" : String.valueOf(car.getYearOfManufacture());

        String vehicle = (brand + " " + model + " " + year).trim().replaceAll("\\s+", " ");
        return vehicle.isBlank() ? "Not specified" : vehicle;
    }

    private String formatStatus(Status status) {
        return status == null ? "Unknown" : formatWords(status.name());
    }

    private String formatAppointmentStatus(boolean accepted) {
        return accepted ? "Accepted" : "Pending confirmation";
    }

    private String formatWords(String value) {
        if (value == null || value.isBlank()) {
            return "Unknown";
        }

        String words = value.replace('_', ' ').toLowerCase(Locale.ENGLISH);
        return Character.toUpperCase(words.charAt(0)) + words.substring(1);
    }

    private String safeText(String value, String fallback) {
        return value == null || value.isBlank() ? fallback : value.trim();
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
