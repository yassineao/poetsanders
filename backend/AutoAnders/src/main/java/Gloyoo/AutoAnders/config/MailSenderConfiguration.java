package Gloyoo.AutoAnders.config;

import org.springframework.boot.autoconfigure.mail.MailProperties;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;

import java.util.Properties;

@Configuration
@EnableConfigurationProperties(MailProperties.class)
public class MailSenderConfiguration {

    @Bean
    public JavaMailSender javaMailSender(MailProperties mailProperties) {
        JavaMailSenderImpl sender = new JavaMailSenderImpl();

        sender.setHost(mailProperties.getHost());

        if (mailProperties.getPort() != null) {
            sender.setPort(mailProperties.getPort());
        }

        sender.setUsername(mailProperties.getUsername());
        sender.setPassword(normalizePassword(mailProperties.getPassword()));
        sender.setProtocol(mailProperties.getProtocol());
        sender.setDefaultEncoding(mailProperties.getDefaultEncoding().name());

        Properties javaMailProperties = new Properties();
        javaMailProperties.putAll(mailProperties.getProperties());
        sender.setJavaMailProperties(javaMailProperties);

        return sender;
    }

    private String normalizePassword(String password) {
        if (password == null) {
            return null;
        }

        return password.replaceAll("\\s+", "");
    }
}