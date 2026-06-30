package Gloyoo.AutoAnders.notification;

import Gloyoo.AutoAnders.user.entity.User;
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

@Service
public class RegisterConfirmationService {

    private static final Logger log =
            LoggerFactory.getLogger(RegisterConfirmationService.class);

    private static final String LOGO_PATH =
            "/logo-poets-website-1.png";

    private final JavaMailSender mailSender;
    private final boolean enabled;
    private final String from;
    private final String appBaseUrl;

    public RegisterConfirmationService(
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

    public void sendRegisterConfirmation(User user) {
        if (!enabled) {
            return;
        }

        if (user == null || user.getEmail() == null || user.getEmail().isBlank()) {
            log.warn("Skipping registration confirmation email because user or email is missing");
            return;
        }

        String customerName = safeText(user.getName(), "customer");
        String customerEmail = user.getEmail();

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

            helper.setTo(customerEmail);
            helper.setSubject("Welcome to Poets Anders");

            helper.setText(
                    buildPlainTextEmail(customerName, customerEmail),
                    buildHtmlEmail(customerName, customerEmail)
            );

            mailSender.send(message);

            log.info("Sent registration confirmation email to {}", customerEmail);

        } catch (MessagingException | MailException exception) {
            log.error(
                    "User {} was saved, but registration confirmation email delivery to {} failed: {}",
                    user.getId(),
                    customerEmail,
                    exception.getMessage()
            );
        }
    }

    private String buildHtmlEmail(
            String customerName,
            String customerEmail
    ) {
        String logoUrl = appBaseUrl + LOGO_PATH;

        return """
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <title>Welcome to Poets Anders</title>
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
                                                Welcome to Poets Anders
                                            </h1>

                                            <p style="margin:10px 0 0; font-size:15px; color:#d8d8d8;">
                                                Your account has been created successfully
                                            </p>
                                        </td>
                                    </tr>

                                    <tr>
                                        <td style="padding:36px;">
                                            <p style="font-size:16px; margin:0 0 18px;">
                                                Hello <strong>%s</strong>,
                                            </p>

                                            <p style="font-size:16px; line-height:1.6; margin:0 0 24px;">
                                                Your Poets Anders account has been created successfully.
                                            </p>

                                            <table width="100%%" cellpadding="0" cellspacing="0" style="background-color:#faf7f2; border-radius:14px; padding:18px; margin:24px 0;">
                                                <tr>
                                                    <td style="padding:10px 0; font-size:14px; color:#777;">
                                                        Email
                                                    </td>
                                                    <td style="padding:10px 0; font-size:15px; text-align:right;">
                                                        <strong>%s</strong>
                                                    </td>
                                                </tr>
                                            </table>

                                            <p style="font-size:15px; line-height:1.6; margin:0 0 26px;">
                                                You can now book appointments, view their status, and manage them online.
                                            </p>

                                            <div style="text-align:center; margin:34px 0;">
                                                <a href="%s"
                                                   style="background-color:#1f1f1f; color:#ffffff; text-decoration:none; padding:15px 30px; border-radius:999px; font-size:16px; font-weight:700; display:inline-block;">
                                                    Visit Poets Anders
                                                </a>
                                            </div>

                                            <p style="font-size:13px; line-height:1.6; color:#777; margin:22px 0 0;">
                                                If you did not create this account, you can safely ignore this email.
                                            </p>

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
                escapeHtml(customerEmail),
                escapeHtml(appBaseUrl)
        );
    }

    private String buildPlainTextEmail(
            String customerName,
            String customerEmail
    ) {
        return """
                Hello %s,

                Your Poets Anders account has been created successfully.

                Email: %s

                You can now book appointments, view their status, and manage them online.

                Visit Poets Anders:
                %s

                If you did not create this account, you can safely ignore this email.

                Kind regards,
                Poets Anders
                """.formatted(
                customerName,
                customerEmail,
                appBaseUrl
        );
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
