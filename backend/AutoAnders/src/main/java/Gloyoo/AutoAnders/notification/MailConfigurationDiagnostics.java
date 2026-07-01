package Gloyoo.AutoAnders.notification;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

@Component
public class MailConfigurationDiagnostics implements ApplicationRunner {

    private static final Logger log =
            LoggerFactory.getLogger(MailConfigurationDiagnostics.class);

    private final boolean enabled;
    private final String host;
    private final int port;
    private final String username;
    private final String password;
    private final String from;
    private final String resendApiKey;

    public MailConfigurationDiagnostics(
            @Value("${app.mail.enabled:false}") boolean enabled,
            @Value("${spring.mail.host:}") String host,
            @Value("${spring.mail.port:587}") int port,
            @Value("${spring.mail.username:}") String username,
            @Value("${spring.mail.password:}") String password,
            @Value("${app.mail.from:}") String from,
            @Value("${resend.api-key:}") String resendApiKey
    ) {
        this.enabled = enabled;
        this.host = host;
        this.port = port;
        this.username = username;
        this.password = password;
        this.from = from;
        this.resendApiKey = resendApiKey;
    }

    @Override
    public void run(ApplicationArguments args) {
        if (!enabled) {
            log.warn("Email delivery is disabled. Set MAIL_ENABLED=true to send notifications.");
            return;
        }

        if (resendApiKey != null && !resendApiKey.isBlank()) {
            log.info("Email delivery is enabled via Resend.");

            if (from.isBlank()) {
                log.error("Email delivery is enabled via Resend but MAIL_FROM is missing.");
            }

            return;
        }

        log.info("Email delivery is enabled via SMTP host {} on port {}", host, port);

        if (host.isBlank() || username.isBlank() || password.isBlank() || from.isBlank()) {
            log.error(
                    "Email delivery is enabled but SMTP configuration is incomplete. "
                            + "Set RESEND_API_KEY to use Resend, or check MAIL_HOST, MAIL_USERNAME, MAIL_PASSWORD, and MAIL_FROM."
            );
        }

        if (password.chars().anyMatch(Character::isWhitespace)) {
            log.warn(
                    "MAIL_PASSWORD contains whitespace. The backend will remove whitespace before SMTP login, "
                            + "but Render should ideally store the Gmail app password as the 16-character value without spaces."
            );
        }
    }
}
