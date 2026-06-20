package Gloyoo.AutoAnders.notification;

import Gloyoo.AutoAnders.Cars.entity.Car;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.text.NumberFormat;
import java.util.Locale;

@Service
public class CarManagementEmail {

    private static final Logger log =
            LoggerFactory.getLogger(CarManagementEmail.class);

    private static final String LOGO_PATH =
            "/logo-poets-website-1.png";

    private static final Locale DISPLAY_LOCALE =
            Locale.ENGLISH;

    private final JavaMailSender mailSender;
    private final boolean enabled;
    private final String from;
    private final String appBaseUrl;

    public CarManagementEmail(
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

    public void sendCarRequestConfirmation(
            String customerName,
            String customerEmail,
            Car car
    ) {
        if (!enabled) {
            return;
        }

        if (car == null) {
            log.warn("Skipping car request confirmation email because car is missing");
            return;
        }

        if (customerEmail == null || customerEmail.isBlank()) {
            log.warn("Skipping car request confirmation email for car {} because customer email is missing", car.getId());
            return;
        }

        String safeCustomerName = safeText(customerName, "customer");
        String safeCustomerEmail = customerEmail.trim();

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

            helper.setTo(safeCustomerEmail);
            helper.setSubject("AutoAnders car request received");

            helper.setText(
                    buildPlainTextEmail(safeCustomerName, car),
                    buildHtmlEmail(safeCustomerName, car)
            );

            mailSender.send(message);

            log.info("Sent car request confirmation email for car {} to {}", car.getId(), safeCustomerEmail);

        } catch (MessagingException | MailException exception) {
            log.error(
                    "Car {} was saved, but confirmation email delivery to {} failed",
                    car.getId(),
                    safeCustomerEmail,
                    exception
            );
        }
    }

    private String buildHtmlEmail(
            String customerName,
            Car car
    ) {
        String logoUrl = appBaseUrl + LOGO_PATH;
        String manageUrl = appBaseUrl + "/account";

        return """
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <title>Car Request Received</title>
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
                                                Car Request Received
                                            </h1>
                                            <p style="margin:10px 0 0; font-size:15px; color:#d8d8d8;">
                                                AutoAnders
                                            </p>
                                        </td>
                                    </tr>

                                    <tr>
                                        <td style="padding:36px;">
                                            <p style="font-size:16px; margin:0 0 18px;">
                                                Hello <strong>%s</strong>,
                                            </p>

                                            <p style="font-size:16px; line-height:1.6; margin:0 0 24px;">
                                                We received your car request successfully. It is currently
                                                <strong style="color:#9a6a2f;">pending review</strong>.
                                            </p>

                                            <table width="100%%" cellpadding="0" cellspacing="0" style="background-color:#faf7f2; border-radius:14px; padding:18px; margin:24px 0;">
                                                <tr>
                                                    <td style="padding:10px 0; font-size:14px; color:#777;">Vehicle</td>
                                                    <td style="padding:10px 0; font-size:15px; text-align:right;">
                                                        <strong>%s</strong>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td style="padding:10px 0; font-size:14px; color:#777;">License plate</td>
                                                    <td style="padding:10px 0; font-size:15px; text-align:right;">
                                                        <strong>%s</strong>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td style="padding:10px 0; font-size:14px; color:#777;">Price</td>
                                                    <td style="padding:10px 0; font-size:15px; text-align:right;">
                                                        <strong>%s</strong>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td style="padding:10px 0; font-size:14px; color:#777;">Status</td>
                                                    <td style="padding:10px 0; font-size:15px; text-align:right;">
                                                        <strong>%s</strong>
                                                    </td>
                                                </tr>
                                            </table>

                                            <p style="font-size:15px; line-height:1.6; margin:0 0 26px;">
                                                You can manage this car and view the status of your requests from your account.
                                            </p>

                                            <div style="text-align:center; margin:34px 0;">
                                                <a href="%s"
                                                   style="background-color:#1f1f1f; color:#ffffff; text-decoration:none; padding:15px 30px; border-radius:999px; font-size:16px; font-weight:700; display:inline-block;">
                                                    View Account
                                                </a>
                                            </div>

                                            <p style="font-size:16px; line-height:1.6; margin:34px 0 0;">
                                                Kind regards,<br>
                                                <strong>AutoAnders</strong>
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
                escapeHtml(formatVehicle(car)),
                escapeHtml(safeText(car.getLicensePlate(), "Not specified")),
                escapeHtml(formatCurrency(car.getPrice())),
                escapeHtml(formatStatus(car)),
                escapeHtml(manageUrl)
        );
    }

    private String buildPlainTextEmail(
            String customerName,
            Car car
    ) {
        return """
                Hello %s,

                We received your car request successfully. It is currently pending review.

                Vehicle: %s
                License plate: %s
                Price: %s
                Status: %s

                You can manage this car and view the status of your requests from your account:
                %s/account

                Kind regards,
                AutoAnders
                """.formatted(
                customerName,
                formatVehicle(car),
                safeText(car.getLicensePlate(), "Not specified"),
                formatCurrency(car.getPrice()),
                formatStatus(car),
                appBaseUrl
        );
    }

    private String formatVehicle(Car car) {
        String brand = safeText(car.getBrand(), "");
        String model = safeText(car.getModel(), "");
        String year = car.getYearOfManufacture() == null ? "" : String.valueOf(car.getYearOfManufacture());

        String vehicle = (brand + " " + model + " " + year).trim().replaceAll("\\s+", " ");
        return vehicle.isBlank() ? "Not specified" : vehicle;
    }

    private String formatStatus(Car car) {
        if (car.getStatus() == null) {
            return "Pending review";
        }

        String words = car.getStatus().name().replace('_', ' ').toLowerCase(DISPLAY_LOCALE);
        return Character.toUpperCase(words.charAt(0)) + words.substring(1);
    }

    private String formatCurrency(BigDecimal value) {
        if (value == null) {
            return "Not specified";
        }

        NumberFormat formatter = NumberFormat.getCurrencyInstance(Locale.forLanguageTag("nl-NL"));
        formatter.setMaximumFractionDigits(0);
        return formatter.format(value);
    }

    private String safeText(String value, String fallback) {
        if (value == null || value.isBlank()) {
            return fallback;
        }

        return value.trim();
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
