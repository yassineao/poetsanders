package Gloyoo.AutoAnders.Cars.entity;

import Gloyoo.AutoAnders.Cars.repository.CarRepository;
import Gloyoo.AutoAnders.Cars.service.CarService;
import Gloyoo.AutoAnders.user.entity.Role;
import Gloyoo.AutoAnders.user.entity.User;
import Gloyoo.AutoAnders.user.repository.UserRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.springframework.dao.DataIntegrityViolationException;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.util.Optional;
import java.util.UUID;

import static org.hibernate.validator.internal.util.Contracts.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;


    @SpringBootTest
    @Testcontainers
    class CarTest {

        @Container
        @ServiceConnection
        static final PostgreSQLContainer<?> postgres =
                new PostgreSQLContainer<>("postgres:17-alpine");

        @Autowired
        private CarRepository carRepository;

        @Autowired
        private UserRepository userRepository;


        private User user;

        @BeforeEach
        void userSetUp() {
            user = User.builder()
                    .email("test@test.com")
                    .password("test123")
                    .name("test")
                    .role(Role.USER)
                    .build();

            user = userRepository.saveAndFlush(user);
        }

        @AfterEach
        void carTearDown() {
            carRepository.deleteAll();
            userRepository.deleteAll();
        }

        @Test
        void carShouldNotBeNull() {



            Car car = Car.builder()
                    .brand("BMW")
                    .model("320i")
                    .user(user)
                    .build();

            Car savedCar = carRepository.saveAndFlush(car);

            assertNotNull(savedCar);
            assertNotNull(savedCar.getId());
        }

        @Test
        void shouldRejectCarWithoutBrand() {
            Car car = Car.builder()
                    // brand absichtlich fehlt
                    .model("320i")
                    .user(user)
                    .build();

            assertThrows(
                    DataIntegrityViolationException.class,
                    () -> carRepository.saveAndFlush(car)
            );
        }

}
