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
import org.springframework.web.util.UriComponentsBuilder;

import java.nio.charset.StandardCharsets;

@Service
public class ProfileAccessEmailService {

    private static final Logger log = LoggerFactory.getLogger(ProfileAccessEmailService.class);

    private final JavaMailSender mailSender;
    private final boolean enabled;
    private final String from;
    private final String apiBaseUrl;

    public ProfileAccessEmailService(
            JavaMailSender mailSender,
            @Value("${app.mail.enabled:false}") boolean enabled,
            @Value("${app.mail.from:}") String from,
            @Value("${app.api-base-url:http://localhost:8080}") String apiBaseUrl
    ) {
        this.mailSender = mailSender;
        this.enabled = enabled;
        this.from = from;
        this.apiBaseUrl = removeTrailingSlash(apiBaseUrl);
    }

    public void sendProfileAccess(User user, String token) {
        if (!enabled) {
            return;
        }

        if (user == null || user.getEmail() == null || user.getEmail().isBlank()) {
            log.warn("Skipping profile access email because user or email is missing");
            return;
        }

        @SuppressWarnings("deprecation")
        String accessUrl = UriComponentsBuilder
                .fromHttpUrl(apiBaseUrl + "/auth/profile-access")
                .queryParam("token", token)
                .build()
                .toUriString();

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

            helper.setTo(user.getEmail());
            helper.setSubject("Access your AutoAnders profile");
            helper.setText(
                    buildPlainTextEmail(user, accessUrl),
                    buildHtmlEmail(user, accessUrl)
            );

            mailSender.send(message);
            log.info("Sent one-time profile access email to {}", user.getEmail());
        } catch (MessagingException | MailException exception) {
            log.error(
                    "User {} was saved, but profile access email delivery to {} failed: {}",
                    user.getId(),
                    user.getEmail(),
                    exception.getMessage()
            );
        }
    }

    private String buildHtmlEmail(User user, String accessUrl) {
        String customerName = safeText(user.getName(), "customer");

        return """
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <title>Access your AutoAnders profile</title>
                </head>
                <body style="margin:0; padding:0; background-color:#f4f4f5; font-family:Arial, Helvetica, sans-serif; color:#18181b;">
                    <table width="100%%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f5; padding:32px 0;">
                        <tr>
                            <td align="center">
                                <table width="600" cellpadding="0" cellspacing="0" style="width:600px; max-width:100%%; background-color:#ffffff; border-radius:14px; overflow:hidden;">
                                    <tr>
                                        <td style="background-color:#09090b; color:#ffffff; padding:30px 36px;">
                                            <h1 style="margin:0; font-size:24px;">Your AutoAnders profile is ready</h1>
                                            <p style="margin:10px 0 0; color:#d4d4d8;">Use this one-time link to open your profile and set your password.</p>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding:34px 36px;">
                                            <p style="font-size:16px; line-height:1.6; margin:0 0 20px;">
                                                Hello <strong>%s</strong>,
                                            </p>
                                            <p style="font-size:16px; line-height:1.6; margin:0 0 26px;">
                                                An AutoAnders account has been created for you. Click the button below to access your profile one time and change your password.
                                            </p>
                                            <div style="text-align:center; margin:32px 0;">
                                                <a href="%s" style="background-color:#dc2626; color:#ffffff; text-decoration:none; padding:14px 24px; border-radius:8px; font-size:16px; font-weight:700; display:inline-block;">
                                                    Open my profile
                                                </a>
                                            </div>
                                            <p style="font-size:13px; line-height:1.6; color:#71717a; margin:24px 0 0;">
                                                This link can be used once and expires automatically. If you did not expect this email, you can ignore it.
                                            </p>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                </body>
                </html>
                """.formatted(escapeHtml(customerName), escapeHtml(accessUrl));
    }

    private String buildPlainTextEmail(User user, String accessUrl) {
        return """
                Hello %s,

                An AutoAnders account has been created for you.

                Use this one-time link to access your profile and change your password:
                %s

                This link can be used once and expires automatically.

                Kind regards,
                AutoAnders
                """.formatted(safeText(user.getName(), "customer"), accessUrl);
    }

    private String safeText(String value, String fallback) {
        return value == null || value.isBlank() ? fallback : value;
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
