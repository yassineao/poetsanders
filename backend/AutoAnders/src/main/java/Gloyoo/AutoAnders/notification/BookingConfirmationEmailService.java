package Gloyoo.AutoAnders.notification;

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

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;

@Service
public class BookingConfirmationEmailService {

    private static final Logger log =
            LoggerFactory.getLogger(BookingConfirmationEmailService.class);

    private static final DateTimeFormatter APPOINTMENT_FORMAT =
            DateTimeFormatter.ofPattern("EEEE, d MMMM yyyy 'at' HH:mm", Locale.ENGLISH);

    private static final String LOGO_PATH =
            "/logo-poets-website-1.png";

    private final JavaMailSender mailSender;
    private final boolean enabled;
    private final String from;
    private final String appBaseUrl;

    public BookingConfirmationEmailService(
            JavaMailSender mailSender,
            @Value("${app.mail.enabled:false}") boolean enabled,
            @Value("${app.mail.from:}") String from,
            @Value("${app.base-url:http://localhost:8080}") String appBaseUrl
    ) {
        this.mailSender = mailSender;
        this.enabled = enabled;
        this.from = from;
        this.appBaseUrl = removeTrailingSlash(appBaseUrl);
    }

    public void sendBookingConfirmation(
            String customerName,
            String customerEmail,
            boolean guest,
            List<WashCalendar> appointments
    ) {
        if (!enabled || appointments == null || appointments.isEmpty()) {
            return;
        }

        if (customerEmail == null || customerEmail.isBlank()) {
            log.warn("Skipping booking confirmation email because customer email is missing");
            return;
        }

        WashCalendar firstAppointment = appointments.get(0);

        String treatments = appointments.stream()
                .filter(appointment -> appointment.getWashType() != null)
                .map(appointment -> formatTreatment(appointment.getWashType().name()))
                .distinct()
                .collect(Collectors.joining(", "));

        if (treatments.isBlank()) {
            treatments = "Not specified";
        }

        String appointmentTime = firstAppointment.getLocalDateTime() == null
                ? "Unknown"
                : firstAppointment.getLocalDateTime().format(APPOINTMENT_FORMAT);

        String cancellationToken = firstAppointment.getCancellationToken();

        String cancelUrl = appBaseUrl + "/appointments/cancel?token=" +
                URLEncoder.encode(
                        cancellationToken == null ? "" : cancellationToken,
                        StandardCharsets.UTF_8
                );

        String manageUrl = appBaseUrl + "/appointments";
        String registerUrl = appBaseUrl + "/register";

        String safeCustomerName = customerName == null || customerName.isBlank()
                ? "customer"
                : customerName;

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

            if(guest){
                customerEmail= customerEmail.substring(customerEmail.indexOf("::")+2);
            }

            helper.setTo(customerEmail);
            helper.setSubject("Poets Anders appointment request received");

            helper.setText(
                    buildPlainTextEmail(
                            safeCustomerName,
                            appointmentTime,
                            treatments,
                            cancelUrl,
                            manageUrl,
                            registerUrl,
                            cancellationToken,
                            guest
                    ),
                    buildHtmlEmail(
                            safeCustomerName,
                            appointmentTime,
                            treatments,
                            cancelUrl,
                            manageUrl,
                            registerUrl,
                            cancellationToken,
                            guest
                    )
            );

            mailSender.send(message);

            log.info("Sent booking confirmation email to {}", customerEmail);

        } catch (MessagingException | MailException exception) {
            log.error(
                    "Appointment {} was saved, but confirmation email delivery to {} failed",
                    firstAppointment.getId(),
                    customerEmail,
                    exception
            );
        }
    }

    private String buildHtmlEmail(
            String customerName,
            String appointmentTime,
            String treatments,
            String cancelUrl,
            String manageUrl,
            String registerUrl,
            String cancellationToken,
            boolean guest
    ) {
        String logoUrl = appBaseUrl + LOGO_PATH;

        String accountInfoHtml = guest
                ? """
                  <div style="background-color:#f7f1e8; border-left:4px solid #9a6a2f; padding:16px 18px; border-radius:10px; margin:28px 0;">
                      <p style="font-size:15px; line-height:1.6; margin:0 0 10px;">
                          <strong>You booked this appointment as a guest.</strong>
                      </p>
                      <p style="font-size:14px; line-height:1.6; margin:0; color:#666;">
                          Create an account to add more appointments, view the status of all your appointments,
                          and manage everything online in one place.
                      </p>
                  </div>
                  """
                : """
                  <p style="font-size:15px; line-height:1.6; margin:0 0 26px;">
                      You can manage this appointment and view all your appointments from your account.
                  </p>
                  """;

        String actionButtonsHtml = guest
                ? """
                  <div style="text-align:center; margin:34px 0 16px;">
                      <a href="%s"
                         style="background-color:#b65f5f; color:#ffffff; text-decoration:none; padding:15px 30px; border-radius:999px; font-size:16px; font-weight:700; display:inline-block; margin:0 6px 12px;">
                          Cancel Appointment
                      </a>
                      <a href="%s"
                         style="background-color:#1f1f1f; color:#ffffff; text-decoration:none; padding:15px 30px; border-radius:999px; font-size:16px; font-weight:700; display:inline-block; margin:0 6px 12px;">
                          Register Now
                      </a>
                  </div>
                  """.formatted(
                escapeHtml(cancelUrl),
                escapeHtml(registerUrl)
        )
                : """
                  <div style="text-align:center; margin:34px 0;">
                      <a href="%s"
                         style="background-color:#1f1f1f; color:#ffffff; text-decoration:none; padding:15px 30px; border-radius:999px; font-size:16px; font-weight:700; display:inline-block;">
                          Manage Appointment
                      </a>
                  </div>
                  """.formatted(escapeHtml(manageUrl));

        String privateLinkInfoHtml = guest
                ? """
                  <p style="font-size:13px; line-height:1.6; color:#777; margin:22px 0 0;">
                      This cancellation link is private. Anyone with this link can cancel every treatment in this appointment.
                  </p>

                  <p style="font-size:12px; color:#999; word-break:break-all; margin:12px 0 0;">
                      Cancellation token: %s
                  </p>
                  """.formatted(escapeHtml(cancellationToken))
                : "";

        return """
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <title>Appointment Request Received</title>
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
                                                Appointment Request Received
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
                                                Thank you for your appointment request. We received it successfully and it is currently
                                                <strong style="color:#9a6a2f;">pending confirmation</strong>.
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

                                            %s

                                            %s

                                            %s

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
                accountInfoHtml,
                actionButtonsHtml,
                privateLinkInfoHtml
        );
    }

    private String buildPlainTextEmail(
            String customerName,
            String appointmentTime,
            String treatments,
            String cancelUrl,
            String manageUrl,
            String registerUrl,
            String cancellationToken,
            boolean guest
    ) {
        String accountInfo = guest
                ? """
                  You booked this appointment as a guest.

                  Create an account to add more appointments, view the status of all your appointments,
                  and manage everything online in one place.
                  """
                : """
                  You can manage this appointment and view all your appointments from your account.
                  """;

        String actionInfo = guest
                ? """
                  Cancel appointment:
                  %s

                  Register now:
                  %s

                  Cancellation token: %s
                  Keep this token private. It can cancel every treatment in this appointment.
                  """.formatted(cancelUrl, registerUrl, cancellationToken)
                : """
                  Manage appointment:
                  %s
                  """.formatted(manageUrl);

        return """
                Hello %s,

                We received your appointment request.

                Date and time: %s
                Treatments: %s

                Your request is currently pending confirmation.

                %s

                %s

                Kind regards,
                Poets Anders
                """.formatted(
                customerName,
                appointmentTime,
                treatments,
                accountInfo,
                actionInfo
        );
    }

    private String formatTreatment(String washType) {
        if (washType == null || washType.isBlank()) {
            return "Unknown";
        }

        String words = washType.replace('_', ' ').toLowerCase(Locale.ENGLISH);
        return Character.toUpperCase(words.charAt(0)) + words.substring(1);
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