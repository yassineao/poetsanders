package Gloyoo.AutoAnders.user.service;

import Gloyoo.AutoAnders.Cars.repository.CarRepository;
import Gloyoo.AutoAnders.user.dto.UserCreateRequest;
import Gloyoo.AutoAnders.user.entity.Role;
import Gloyoo.AutoAnders.user.entity.User;
import Gloyoo.AutoAnders.user.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class UserServiceTest {

    @Test
    void registrationUpgradesMatchingGuestAndPreservesItsIdentity() {
        UserRepository users = mock(UserRepository.class);
        CarRepository cars = mock(CarRepository.class);
        PasswordEncoder encoder = mock(PasswordEncoder.class);
        UserService service = new UserService(users, cars, encoder, "guest::");
        UUID guestId = UUID.randomUUID();
        User guest = User.builder()
                .id(guestId)
                .email("guest::customer@example.com")
                .name("Guest Name")
                .phoneNumber("0611111111")
                .password("generated-password-hash")
                .role(Role.USER)
                .build();
        UserCreateRequest request = registrationRequest(" Customer@Example.com ");

        when(users.existsByEmailIgnoreCase("customer@example.com")).thenReturn(false);
        when(users.findByEmail("guest::customer@example.com")).thenReturn(Optional.of(guest));
        when(encoder.encode(request.getPassword())).thenReturn("real-password-hash");
        when(users.save(guest)).thenReturn(guest);

        User registered = service.register(request);

        assertSame(guest, registered);
        assertEquals(guestId, registered.getId());
        assertEquals("customer@example.com", registered.getEmail());
        assertEquals("Customer Name", registered.getName());
        assertEquals("0612345678", registered.getPhoneNumber());
        assertEquals("real-password-hash", registered.getPassword());
        verify(users).save(guest);
    }

    @Test
    void registrationStillRejectsAnExistingRealAccount() {
        UserRepository users = mock(UserRepository.class);
        UserService service = new UserService(
                users,
                mock(CarRepository.class),
                mock(PasswordEncoder.class),
                "guest::"
        );
        UserCreateRequest request = registrationRequest("customer@example.com");

        when(users.existsByEmailIgnoreCase("customer@example.com")).thenReturn(true);

        assertThrows(IllegalArgumentException.class, () -> service.register(request));
        verify(users, never()).save(org.mockito.ArgumentMatchers.any(User.class));
        verify(users, never()).findByEmail("guest::customer@example.com");
    }

    @Test
    void guestContactEmailRemovesConfiguredPrefix() {
        UserService service = new UserService(
                mock(UserRepository.class),
                mock(CarRepository.class),
                mock(PasswordEncoder.class),
                "guest::"
        );
        User guest = User.builder()
                .email("guest::customer@example.com")
                .build();

        assertEquals("customer@example.com", service.contactEmail(guest));
    }

    @Test
    void guestRegistrationRejectsEmailAlreadyRegisteredAsUser() {
        UserRepository users = mock(UserRepository.class);
        PasswordEncoder encoder = mock(PasswordEncoder.class);
        UserService service = new UserService(
                users,
                mock(CarRepository.class),
                encoder,
                "guest::"
        );

        when(users.existsByEmailIgnoreCase("customer@example.com")).thenReturn(true);

        ResponseStatusException ex = assertThrows(
                ResponseStatusException.class,
                () -> service.registerGuest("Guest Name", "customer@example.com", "0612345678")
        );

        assertEquals("This email is already registered as a user account", ex.getReason());
        verify(users, never()).save(org.mockito.ArgumentMatchers.any(User.class));
    }

    private UserCreateRequest registrationRequest(String email) {
        UserCreateRequest request = new UserCreateRequest();
        request.setEmail(email);
        request.setName(" Customer Name ");
        request.setPhoneNumber(" 0612345678 ");
        request.setPassword("StrongPass1!");
        return request;
    }
}
