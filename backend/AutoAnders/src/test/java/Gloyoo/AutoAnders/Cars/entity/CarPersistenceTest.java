package Gloyoo.AutoAnders.Cars.entity;

import Gloyoo.AutoAnders.CarPictures.entity.CarPicture;
import Gloyoo.AutoAnders.user.entity.User;
import Gloyoo.AutoAnders.washCalendar.entity.WashCalendar;
import jakarta.persistence.OptimisticLockException;
import org.flywaydb.core.Flyway;
import org.hibernate.SessionFactory;
import org.hibernate.cfg.Configuration;
import org.junit.jupiter.api.Test;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.math.BigDecimal;
import java.sql.DriverManager;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

@Testcontainers
class CarPersistenceTest {
    @Container
    static final PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:17-alpine");


    @Test
    void upgradesExistingCarsAndPersistsOrderedFeaturesWithCascadeDeletion() throws Exception {
        Flyway.configure()
                .dataSource(postgres.getJdbcUrl(), postgres.getUsername(), postgres.getPassword())
                .target("13").load().migrate();

        UUID userId = UUID.randomUUID();
        UUID carId = UUID.randomUUID();
        try (var connection = DriverManager.getConnection(
                postgres.getJdbcUrl(), postgres.getUsername(), postgres.getPassword())) {
            try (var statement = connection.prepareStatement(
                    "INSERT INTO users (id, email, password, name, role) VALUES (?, ?, ?, ?, ?)")) {
                statement.setObject(1, userId);
                statement.setString(2, "car-test@example.test");
                statement.setString(3, "test-only");
                statement.setString(4, "Test owner");
                statement.setString(5, "USER");
                statement.executeUpdate();
            }
            try (var statement = connection.prepareStatement(
                    "INSERT INTO cars (id, user_id, brand, model, apk_mot_date, power) VALUES (?, ?, ?, ?, ?, ?)")) {
                statement.setObject(1, carId);
                statement.setObject(2, userId);
                statement.setString(3, "Test brand");
                statement.setString(4, "Test model");
                statement.setString(5, "2027-01-01");
                statement.setString(6, "150 hp");
                statement.executeUpdate();
            }
        }

        Flyway.configure()
                .dataSource(postgres.getJdbcUrl(), postgres.getUsername(), postgres.getPassword())
                .load().migrate();

        try (SessionFactory factory = new Configuration()
                .addAnnotatedClass(Car.class)
                .addAnnotatedClass(User.class)
                .addAnnotatedClass(CarPicture.class)
                .addAnnotatedClass(WashCalendar.class)
                .setProperty("hibernate.connection.url", postgres.getJdbcUrl())
                .setProperty("hibernate.connection.username", postgres.getUsername())
                .setProperty("hibernate.connection.password", postgres.getPassword())
                .setProperty("hibernate.hbm2ddl.auto", "validate")
                .setProperty("hibernate.physical_naming_strategy",
                        "org.hibernate.boot.model.naming.CamelCaseToUnderscoresNamingStrategy")
                .buildSessionFactory()) {
            Instant createdAt;
            try (var session = factory.openSession()) {
                var transaction = session.beginTransaction();
                Car car = session.find(Car.class, carId);
                assertThat(car.getVersion()).isZero();
                assertThat(car.getFeatured()).isFalse();
                assertThat(car.getReserved()).isFalse();
                assertThat(car.getSold()).isFalse();
                assertThat(car.getApkMotDate()).isEqualTo("2027-01-01");
                assertThat(car.getPower()).isEqualTo("150 hp");
                createdAt = car.getCreatedAt();
                assertThat(createdAt).isNotNull();
                car.setDriveType(DriveType.ALL_WHEEL_DRIVE);
                car.setBatteryCapacityKwh(new BigDecimal("75.50"));
                car.addFeature(" Heated seats ");
                car.addFeature("Heated seats");
                car.addFeature("Rear camera");
                car.addFeature(" ");
                car.addFeature(null);
                transaction.commit();
            }
            try (var session = factory.openSession()) {
                var transaction = session.beginTransaction();
                Car car = session.find(Car.class, carId);
                assertThat(car.getDriveType()).isEqualTo(DriveType.ALL_WHEEL_DRIVE);
                assertThat(car.getBatteryCapacityKwh()).isEqualByComparingTo("75.50");
                assertThat(car.getFeatures()).containsExactly("Heated seats", "Rear camera");
                assertThat(car.getVersion()).isPositive();
                assertThat(car.getCreatedAt()).isEqualTo(createdAt);
                assertThat(car.getUpdatedAt()).isNotNull();
                car.getFeatures().remove("Heated seats");
                transaction.commit();
            }
            try (var first = factory.openSession(); var second = factory.openSession()) {
                var firstTransaction = first.beginTransaction();
                var secondTransaction = second.beginTransaction();
                Car firstCopy = first.find(Car.class, carId);
                Car staleCopy = second.find(Car.class, carId);
                firstCopy.setFeatured(true);
                firstTransaction.commit();
                staleCopy.setReserved(true);
                assertThatThrownBy(second::flush).isInstanceOf(OptimisticLockException.class);
                secondTransaction.rollback();
            }
            try (var session = factory.openSession()) {
                var transaction = session.beginTransaction();
                Car car = session.find(Car.class, carId);
                assertThat(car.getFeatures()).containsExactly("Rear camera");
                assertThat(car.getFeatured()).isTrue();
                assertThat(car.getReserved()).isFalse();
                session.remove(car);
                transaction.commit();
            }
            try (var session = factory.openSession()) {
                assertThat(session.createNativeQuery(
                        "SELECT count(*) FROM car_features", Long.class).getSingleResult()).isZero();
                var transaction = session.beginTransaction();
                Car car = Car.builder().brand("New brand").model("New model")
                        .user(session.getReference(User.class, userId)).build();
                car.addFeature("Navigation");
                session.persist(car);
                transaction.commit();
                assertThat(car.getCreatedAt()).isNotNull();
                assertThat(car.getUpdatedAt()).isNotNull();
                assertThat(car.getFeatures()).isEqualTo(List.of("Navigation"));
                session.clear();
                Car reloaded = session.find(Car.class, car.getId());
                assertThat(reloaded.getVersion()).isZero();
                assertThat(reloaded.getFeatured()).isFalse();
                assertThat(reloaded.getReserved()).isFalse();
                assertThat(reloaded.getSold()).isFalse();
                assertThat(reloaded.getFeatures()).containsExactly("Navigation");

                // Verify the database cascade independently of Hibernate's collection cleanup.
                var deleteTransaction = session.beginTransaction();
                session.createNativeMutationQuery("DELETE FROM cars WHERE id = :id")
                        .setParameter("id", car.getId()).executeUpdate();
                deleteTransaction.commit();
                assertThat(session.createNativeQuery(
                        "SELECT count(*) FROM car_features", Long.class).getSingleResult()).isZero();
            }
        }
    }
}
