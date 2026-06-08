package Gloyoo.AutoAnders.config;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.core.env.Environment;

import javax.sql.DataSource;
import java.net.URI;

@Configuration
public class DataSourceConfig {

    @Bean
    @Primary
    public DataSource dataSource(Environment environment) {
        DatabaseSettings settings = resolveDatabaseSettings(environment);

        HikariConfig hikariConfig = new HikariConfig();
        hikariConfig.setJdbcUrl(settings.jdbcUrl());

        if (hasText(settings.username())) {
            hikariConfig.setUsername(settings.username());
        }

        if (hasText(settings.password())) {
            hikariConfig.setPassword(settings.password());
        }

        hikariConfig.setMaximumPoolSize(environment.getProperty("spring.datasource.hikari.maximum-pool-size", Integer.class, 10));
        hikariConfig.setMinimumIdle(environment.getProperty("spring.datasource.hikari.minimum-idle", Integer.class, 2));
        hikariConfig.setKeepaliveTime(environment.getProperty("spring.datasource.hikari.keepaliveTime", Long.class, 300000L));
        hikariConfig.setIdleTimeout(environment.getProperty("spring.datasource.hikari.idle-timeout", Long.class, 600000L));

        return new HikariDataSource(hikariConfig);
    }

    private DatabaseSettings resolveDatabaseSettings(Environment environment) {
        String explicitUrl = firstNonBlank(
                environment.getProperty("spring.datasource.url"),
                environment.getProperty("SPRING_DATASOURCE_URL"),
                environment.getProperty("URLDATABASE")
        );

        String explicitUsername = firstNonBlank(
                environment.getProperty("spring.datasource.username"),
                environment.getProperty("SPRING_DATASOURCE_USERNAME"),
                environment.getProperty("PGUSER"),
                environment.getProperty("POSTGRES_USER")
        );

        String explicitPassword = firstNonBlank(
                environment.getProperty("spring.datasource.password"),
                environment.getProperty("SPRING_DATASOURCE_PASSWORD"),
                environment.getProperty("PGPASSWORD"),
                environment.getProperty("POSTGRES_PASSWORD")
        );

        if (hasText(explicitUrl)) {
            return new DatabaseSettings(toJdbcUrl(explicitUrl), explicitUsername, explicitPassword);
        }

        String databaseUrl = firstNonBlank(environment.getProperty("DATABASE_URL"));
        if (hasText(databaseUrl)) {
            return fromDatabaseUrl(databaseUrl, explicitUsername, explicitPassword);
        }

        String host = environment.getProperty("PGHOST");
        String databaseName = firstNonBlank(environment.getProperty("PGDATABASE"), environment.getProperty("POSTGRES_DB"));
        if (hasText(host) && hasText(databaseName)) {
            int port = environment.getProperty("PGPORT", Integer.class, 5432);
            String jdbcUrl = String.format("jdbc:postgresql://%s:%d/%s", host, port, databaseName);
            return new DatabaseSettings(withPostgresCompatibilityParameters(jdbcUrl), explicitUsername, explicitPassword);
        }

        throw new IllegalStateException(
                "Database configuration is missing. Set spring.datasource.url, URLDATABASE, DATABASE_URL, or PGHOST/PGDATABASE along with credentials."
        );
    }

    private DatabaseSettings fromDatabaseUrl(String databaseUrl, String explicitUsername, String explicitPassword) {
        URI uri = URI.create(databaseUrl);

        String scheme = uri.getScheme();
        if (!"postgres".equalsIgnoreCase(scheme) && !"postgresql".equalsIgnoreCase(scheme)) {
            throw new IllegalStateException("DATABASE_URL must use postgres:// or postgresql://");
        }

        String databaseName = uri.getPath() == null ? "" : uri.getPath().replaceFirst("^/", "");
        if (!hasText(databaseName)) {
            throw new IllegalStateException("DATABASE_URL must include a database name");
        }

        StringBuilder jdbcUrl = new StringBuilder();
        jdbcUrl.append("jdbc:postgresql://")
                .append(uri.getHost())
                .append(":")
                .append(uri.getPort() == -1 ? 5432 : uri.getPort())
                .append("/")
                .append(databaseName);

        if (hasText(uri.getRawQuery())) {
            jdbcUrl.append("?").append(uri.getRawQuery());
        }

        String username = explicitUsername;
        String password = explicitPassword;
        if ((!hasText(username) || !hasText(password)) && hasText(uri.getUserInfo())) {
            String[] userInfoParts = uri.getUserInfo().split(":", 2);
            if (!hasText(username) && userInfoParts.length > 0) {
                username = userInfoParts[0];
            }
            if (!hasText(password) && userInfoParts.length == 2) {
                password = userInfoParts[1];
            }
        }

        return new DatabaseSettings(withPostgresCompatibilityParameters(jdbcUrl.toString()), username, password);
    }

    private String toJdbcUrl(String url) {
        if (!hasText(url)) {
            return url;
        }

        if (url.startsWith("jdbc:")) {
            return withPostgresCompatibilityParameters(url);
        }

        if (url.startsWith("postgres://") || url.startsWith("postgresql://")) {
            return fromDatabaseUrl(url, null, null).jdbcUrl();
        }

        return url;
    }

    private String withPostgresCompatibilityParameters(String jdbcUrl) {
        if (!hasText(jdbcUrl) || !jdbcUrl.startsWith("jdbc:postgresql:")) {
            return jdbcUrl;
        }

        if (jdbcUrl.matches(".*[?&]prepareThreshold=.*")) {
            return jdbcUrl;
        }

        String separator = jdbcUrl.contains("?") ? "&" : "?";
        return jdbcUrl + separator + "prepareThreshold=0";
    }

    private String firstNonBlank(String... values) {
        for (String value : values) {
            if (hasText(value)) {
                return value;
            }
        }
        return null;
    }

    private boolean hasText(String value) {
        return value != null && !value.trim().isEmpty();
    }

    private record DatabaseSettings(String jdbcUrl, String username, String password) {
    }
}
