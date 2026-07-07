package Gloyoo.AutoAnders.contact;

import Gloyoo.AutoAnders.user.entity.User;
import Gloyoo.AutoAnders.user.repository.UserRepository;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.UUID;

@Service
public class ContactEmailService {

    private static final Logger log = LoggerFactory.getLogger(ContactEmailService.class);

    private final JavaMailSender mailSender;
    private final boolean enabled;
    private final String from;
    private final String recipient;
    private final ContactMessageRepository contactMessageRepository;
    private final UserRepository userRepository;

    public ContactEmailService(
            JavaMailSender mailSender,
            @Value("${app.mail.enabled:false}") boolean enabled,
            @Value("${app.mail.from:}") String from,
            @Value("${app.contact.recipient:}") String recipient,
            ContactMessageRepository contactMessageRepository,
            UserRepository userRepository
    ) {
        this.mailSender = mailSender;
        this.enabled = enabled;
        this.from = from;
        this.recipient = recipient;
        this.contactMessageRepository = contactMessageRepository;
        this.userRepository = userRepository;
    }

    public UserContactMessageResponse sendContactMessage(ContactMessageRequest request, UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        ContactMessage savedMessage = contactMessageRepository.save(ContactMessage.builder()
                .user(user)
                .companyName(safeText(request.companyName()))
                .phoneNumber(blankToNull(request.phoneNumber()))
                .message(safeText(request.message()))
                .build());

        if (enabled && recipient != null && !recipient.isBlank()) {
            trySendNotification(savedMessage, request, user);
        }

        return UserContactMessageResponse.from(savedMessage);
    }

    public List<UserContactMessageResponse> getMessages(UUID userId) {
        return contactMessageRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(UserContactMessageResponse::from)
                .toList();
    }

    private void trySendNotification(ContactMessage savedMessage, ContactMessageRequest request, User user) {
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

            helper.setTo(recipient);
            helper.setReplyTo(user.getEmail());
            helper.setSubject("AutoAnders internal message: " + safeText(request.companyName()));
            helper.setText(buildPlainTextEmail(request, user), buildHtmlEmail(request, user));

            mailSender.send(message);
            savedMessage.setEmailDelivered(true);
            savedMessage.setEmailError(null);
            contactMessageRepository.save(savedMessage);
            log.info("Sent AutoAnders contact notification from {} to {}", user.getEmail(), recipient);
        } catch (MessagingException | MailException exception) {
            savedMessage.setEmailDelivered(false);
            savedMessage.setEmailError(truncate(exception.getMessage(), 500));
            contactMessageRepository.save(savedMessage);
            log.warn("Saved internal contact message, but email notification failed: {}", exception.getMessage());
        }
    }

    private String buildPlainTextEmail(ContactMessageRequest request, User user) {
        return """
                New AutoAnders internal message

                Customer: %s
                Email: %s
                Vehicle or topic: %s
                Phone number: %s

                Message:
                %s
                """.formatted(
                safeText(user.getName()),
                safeText(user.getEmail()),
                safeText(request.companyName()),
                safeText(firstNonBlank(request.phoneNumber(), user.getPhoneNumber())),
                safeText(request.message())
        );
    }

    private String buildHtmlEmail(ContactMessageRequest request, User user) {
        return """
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <title>AutoAnders internal message</title>
                </head>
                <body style="margin:0; padding:0; background:#f4f4f5; font-family:Arial, Helvetica, sans-serif; color:#18181b;">
                    <table width="100%%" cellpadding="0" cellspacing="0" style="background:#f4f4f5; padding:28px 0;">
                        <tr>
                            <td align="center">
                                <table width="620" cellpadding="0" cellspacing="0" style="width:620px; max-width:100%%; background:#ffffff; border-radius:16px; overflow:hidden;">
                                    <tr>
                                        <td style="background:#18181b; color:#ffffff; padding:28px 32px;">
                                            <h1 style="margin:0; font-size:24px;">New AutoAnders internal message</h1>
                                            <p style="margin:8px 0 0; color:#d4d4d8;">A registered user sent a message.</p>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding:30px 32px;">
                                            <p><strong>Customer:</strong> %s</p>
                                            <p><strong>Email:</strong> %s</p>
                                            <p><strong>Vehicle or topic:</strong> %s</p>
                                            <p><strong>Phone number:</strong> %s</p>
                                            <div style="margin-top:24px; padding:18px; background:#fafafa; border-radius:12px; line-height:1.6; white-space:pre-wrap;">%s</div>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                </body>
                </html>
                """.formatted(
                escapeHtml(user.getName()),
                escapeHtml(user.getEmail()),
                escapeHtml(request.companyName()),
                escapeHtml(firstNonBlank(request.phoneNumber(), user.getPhoneNumber())),
                escapeHtml(request.message())
        );
    }

    private String safeText(String value) {
        if (value == null || value.isBlank()) {
            return "-";
        }

        return value.trim();
    }

    private String blankToNull(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }

    private String firstNonBlank(String first, String second) {
        return first == null || first.isBlank() ? second : first;
    }

    private String truncate(String value, int maxLength) {
        String safeValue = safeText(value);
        return safeValue.length() > maxLength ? safeValue.substring(0, maxLength) : safeValue;
    }

    private String escapeHtml(String value) {
        return safeText(value)
                .replace("&", "&amp;")
                .replace("<", "&lt;")
                .replace(">", "&gt;")
                .replace("\"", "&quot;")
                .replace("'", "&#39;");
    }
}
