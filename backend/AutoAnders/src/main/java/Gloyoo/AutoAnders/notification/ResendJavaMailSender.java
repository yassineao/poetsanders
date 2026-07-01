package Gloyoo.AutoAnders.notification;

import jakarta.mail.Address;
import jakarta.mail.BodyPart;
import jakarta.mail.Message;
import jakarta.mail.MessagingException;
import jakarta.mail.Multipart;
import jakarta.mail.Part;
import jakarta.mail.Session;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.mail.MailException;
import org.springframework.mail.MailParseException;
import org.springframework.mail.MailSendException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessagePreparator;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestClientResponseException;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Properties;

public class ResendJavaMailSender implements JavaMailSender {

    private final RestClient restClient;
    private final String from;

    public ResendJavaMailSender(String apiKey, String emailsUrl, String from) {
        this.from = from;
        this.restClient = RestClient.builder()
                .baseUrl(emailsUrl)
                .defaultHeader(HttpHeaders.AUTHORIZATION, "Bearer " + apiKey)
                .build();
    }

    @Override
    public MimeMessage createMimeMessage() {
        return new MimeMessage(Session.getInstance(new Properties()));
    }

    @Override
    public MimeMessage createMimeMessage(InputStream contentStream) throws MailException {
        try {
            return new MimeMessage(Session.getInstance(new Properties()), contentStream);
        } catch (MessagingException exception) {
            throw new MailParseException("Could not parse MIME message", exception);
        }
    }

    @Override
    public void send(MimeMessage mimeMessage) throws MailException {
        send(new MimeMessage[]{mimeMessage});
    }

    @Override
    public void send(MimeMessage... mimeMessages) throws MailException {
        for (MimeMessage mimeMessage : mimeMessages) {
            sendOne(mimeMessage);
        }
    }

    @Override
    public void send(MimeMessagePreparator mimeMessagePreparator) throws MailException {
        send(new MimeMessagePreparator[]{mimeMessagePreparator});
    }

    @Override
    public void send(MimeMessagePreparator... mimeMessagePreparators) throws MailException {
        List<MimeMessage> messages = new ArrayList<>();
        for (MimeMessagePreparator preparator : mimeMessagePreparators) {
            MimeMessage message = createMimeMessage();
            try {
                preparator.prepare(message);
            } catch (Exception exception) {
                throw new MailParseException("Could not prepare MIME message", exception);
            }
            messages.add(message);
        }
        send(messages.toArray(MimeMessage[]::new));
    }

    @Override
    public void send(SimpleMailMessage simpleMessage) throws MailException {
        send(new SimpleMailMessage[]{simpleMessage});
    }

    @Override
    public void send(SimpleMailMessage... simpleMessages) throws MailException {
        for (SimpleMailMessage simpleMessage : simpleMessages) {
            Map<String, Object> payload = new LinkedHashMap<>();
            payload.put("from", firstNonBlank(simpleMessage.getFrom(), from));
            payload.put("to", Arrays.asList(requireRecipient(simpleMessage.getTo())));
            payload.put("subject", simpleMessage.getSubject());
            payload.put("text", simpleMessage.getText());
            post(payload);
        }
    }

    private void sendOne(MimeMessage message) {
        try {
            MessageBody body = extractBody(message);

            Map<String, Object> payload = new LinkedHashMap<>();
            payload.put("from", firstNonBlank(addressesToString(message.getFrom()), from));
            payload.put("to", addressesToStrings(message.getRecipients(Message.RecipientType.TO)));

            List<String> cc = addressesToStrings(message.getRecipients(Message.RecipientType.CC));
            if (!cc.isEmpty()) {
                payload.put("cc", cc);
            }

            List<String> bcc = addressesToStrings(message.getRecipients(Message.RecipientType.BCC));
            if (!bcc.isEmpty()) {
                payload.put("bcc", bcc);
            }

            payload.put("subject", message.getSubject());

            if (body.html() != null && !body.html().isBlank()) {
                payload.put("html", body.html());
            }
            if (body.text() != null && !body.text().isBlank()) {
                payload.put("text", body.text());
            }

            post(payload);
        } catch (MessagingException | IOException exception) {
            throw new MailParseException("Could not convert MIME message for Resend", exception);
        }
    }

    private void post(Map<String, Object> payload) {
        try {
            restClient.post()
                    .uri("")
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(payload)
                    .retrieve()
                    .toBodilessEntity();
        } catch (RestClientException exception) {
            throw new MailSendException(buildErrorMessage(exception), exception);
        }
    }

    private String buildErrorMessage(RestClientException exception) {
        if (exception instanceof RestClientResponseException responseException) {
            String responseBody = responseException.getResponseBodyAsString();
            if (responseBody == null || responseBody.isBlank()) {
                responseBody = responseException.getStatusText();
            }

            return "Resend email delivery failed with HTTP "
                    + responseException.getStatusCode().value()
                    + ": "
                    + responseBody;
        }

        return "Resend email delivery failed: " + exception.getMessage();
    }

    private MessageBody extractBody(Part part) throws MessagingException, IOException {
        if (part.isMimeType("text/html")) {
            return new MessageBody(null, String.valueOf(part.getContent()));
        }

        if (part.isMimeType("text/plain")) {
            return new MessageBody(String.valueOf(part.getContent()), null);
        }

        Object content = part.getContent();
        if (content instanceof Multipart multipart) {
            String text = null;
            String html = null;

            for (int index = 0; index < multipart.getCount(); index++) {
                BodyPart bodyPart = multipart.getBodyPart(index);
                MessageBody child = extractBody(bodyPart);

                if (text == null && child.text() != null) {
                    text = child.text();
                }
                if (html == null && child.html() != null) {
                    html = child.html();
                }
            }

            return new MessageBody(text, html);
        }

        return new MessageBody(null, null);
    }

    private List<String> addressesToStrings(Address[] addresses) {
        if (addresses == null || addresses.length == 0) {
            return List.of();
        }

        List<String> values = new ArrayList<>();
        for (Address address : addresses) {
            if (address instanceof InternetAddress internetAddress) {
                values.add(internetAddress.toUnicodeString());
            } else {
                values.add(address.toString());
            }
        }
        return values;
    }

    private String addressesToString(Address[] addresses) {
        List<String> values = addressesToStrings(addresses);
        return values.isEmpty() ? "" : String.join(", ", values);
    }

    private String firstNonBlank(String value, String fallback) {
        if (value != null && !value.isBlank()) {
            return value;
        }
        return fallback == null ? "" : fallback;
    }

    private String[] requireRecipient(String[] recipients) {
        if (recipients == null || recipients.length == 0) {
            throw new MailSendException("Missing email recipient");
        }
        return recipients;
    }

    private record MessageBody(String text, String html) {
    }
}
