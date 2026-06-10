package Gloyoo.AutoAnders.washCalendar.service;

import Gloyoo.AutoAnders.user.entity.User;
import Gloyoo.AutoAnders.user.service.UserService;
import Gloyoo.AutoAnders.washCalendar.dto.GuestWashCalendarRequest;
import Gloyoo.AutoAnders.washCalendar.dto.WashCalendarBatchRequest;
import Gloyoo.AutoAnders.washCalendar.dto.WashCalendarRequest;
import Gloyoo.AutoAnders.washCalendar.entity.WashCalendar;
import Gloyoo.AutoAnders.washCalendar.entity.WashType;
import Gloyoo.AutoAnders.washCalendar.repository.WashCalendarRepository;
import org.junit.jupiter.api.Test;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class WashCalendarServiceTest {

    @Test
    void bookingAssignsAuthenticatedUserBeforeSaving() {
        WashCalendarRepository washCalendarRepository = mock(WashCalendarRepository.class);
        UserService userService = mock(UserService.class);
        WashCalendarService service =
                new WashCalendarService(washCalendarRepository, userService);

        UUID userId = UUID.randomUUID();
        User user = User.builder().id(userId).build();
        WashCalendarRequest request = new WashCalendarRequest(
                WashType.Total_Treatment,
                LocalDateTime.of(2026, 6, 8, 14, 30)
        );

        when(userService.findByIdOrThrow(userId)).thenReturn((user));
        when(washCalendarRepository.save(any(WashCalendar.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        WashCalendar saved = service.book_a_wash_calendar(request, userId);

        assertSame(user, saved.getUser());
        verify(userService).findByIdOrThrow(userId);
        verify(washCalendarRepository).save(saved);
    }

    @Test
    void batchBookingSavesAllTreatmentsForAuthenticatedUser() {
        WashCalendarRepository washCalendarRepository = mock(WashCalendarRepository.class);
        UserService userService = mock(UserService.class);
        WashCalendarService service =
                new WashCalendarService(washCalendarRepository, userService);

        UUID userId = UUID.randomUUID();
        User user = User.builder().id(userId).build();
        LocalDateTime appointment = LocalDateTime.of(2026, 6, 8, 14, 30);
        WashCalendarBatchRequest request = new WashCalendarBatchRequest(
                List.of(WashType.Total_Treatment, WashType.Interior_Treatment),
                appointment
        );

        when(userService.findByIdOrThrow(userId)).thenReturn(user);
        when(washCalendarRepository.saveAll(any())).thenAnswer(invocation -> invocation.getArgument(0));

        List<WashCalendar> saved = service.bookWashCalendars(request, userId);

        assertEquals(2, saved.size());
        saved.forEach(washCalendar -> {
            assertSame(user, washCalendar.getUser());
            assertEquals(appointment, washCalendar.getLocalDateTime());
            assertFalse(washCalendar.getCancellationToken().isBlank());
            assertEquals(64, washCalendar.getCancellationTokenHash().length());
        });
        assertEquals(
                saved.getFirst().getCancellationToken(),
                saved.getLast().getCancellationToken()
        );
        assertEquals(
                saved.getFirst().getCancellationTokenHash(),
                saved.getLast().getCancellationTokenHash()
        );
        verify(washCalendarRepository).saveAll(any());
    }

    @Test
    void guestBookingCreatesOneGuestAndSavesAGroupedAppointment() {
        WashCalendarRepository washCalendarRepository = mock(WashCalendarRepository.class);
        UserService userService = mock(UserService.class);
        WashCalendarService service =
                new WashCalendarService(washCalendarRepository, userService);

        User guest = User.builder().id(UUID.randomUUID()).build();
        LocalDateTime appointment = LocalDateTime.of(2026, 6, 12, 10, 30);
        GuestWashCalendarRequest request = new GuestWashCalendarRequest(
                "Guest Customer",
                "guest@example.com",
                "0612345678",
                List.of(
                        WashType.Interior_Treatment,
                        WashType.Interior_Treatment,
                        WashType.Exterior_Treatment
                ),
                appointment
        );

        when(userService.registerGuest(
                request.name(),
                request.email(),
                request.phoneNumber()
        )).thenReturn(guest);
        when(washCalendarRepository.saveAll(any())).thenAnswer(invocation -> invocation.getArgument(0));

        List<WashCalendar> saved = service.bookGuestWashCalendars(request);

        assertEquals(2, saved.size());
        saved.forEach(washCalendar -> {
            assertSame(guest, washCalendar.getUser());
            assertEquals(appointment, washCalendar.getLocalDateTime());
        });
        verify(userService).registerGuest(
                request.name(),
                request.email(),
                request.phoneNumber()
        );
        verify(washCalendarRepository).saveAll(any());
    }

    @Test
    void deleteRejectsAppointmentOwnedByAnotherUser() {
        WashCalendarRepository washCalendarRepository = mock(WashCalendarRepository.class);
        UserService userService = mock(UserService.class);
        WashCalendarService service =
                new WashCalendarService(washCalendarRepository, userService);

        UUID appointmentId = UUID.randomUUID();
        UUID authenticatedUserId = UUID.randomUUID();
        WashCalendar appointment = WashCalendar.builder()
                .id(appointmentId)
                .user(User.builder().id(UUID.randomUUID()).build())
                .build();

        when(washCalendarRepository.findById(appointmentId)).thenReturn(java.util.Optional.of(appointment));

        assertThrows(
                ResponseStatusException.class,
                () -> service.deleteWashCalendar(appointmentId, authenticatedUserId)
        );
        verify(washCalendarRepository, never()).delete(any());
    }

    @Test
    void batchDeleteValidatesEveryOwnerBeforeDeletingAnything() {
        WashCalendarRepository washCalendarRepository = mock(WashCalendarRepository.class);
        UserService userService = mock(UserService.class);
        WashCalendarService service =
                new WashCalendarService(washCalendarRepository, userService);

        UUID authenticatedUserId = UUID.randomUUID();
        UUID ownedId = UUID.randomUUID();
        UUID foreignId = UUID.randomUUID();
        WashCalendar owned = WashCalendar.builder()
                .id(ownedId)
                .user(User.builder().id(authenticatedUserId).build())
                .build();
        WashCalendar foreign = WashCalendar.builder()
                .id(foreignId)
                .user(User.builder().id(UUID.randomUUID()).build())
                .build();

        when(washCalendarRepository.findAllById(List.of(ownedId, foreignId)))
                .thenReturn(List.of(owned, foreign));

        assertThrows(
                ResponseStatusException.class,
                () -> service.deleteWashCalendars(
                        List.of(ownedId, foreignId),
                        authenticatedUserId
                )
        );
        verify(washCalendarRepository, never()).deleteAll(any());
    }

    @Test
    void batchDeleteRejectsMissingIdsBeforeDeletingAnything() {
        WashCalendarRepository washCalendarRepository = mock(WashCalendarRepository.class);
        UserService userService = mock(UserService.class);
        WashCalendarService service =
                new WashCalendarService(washCalendarRepository, userService);

        UUID authenticatedUserId = UUID.randomUUID();
        UUID existingId = UUID.randomUUID();
        UUID missingId = UUID.randomUUID();
        WashCalendar existing = WashCalendar.builder()
                .id(existingId)
                .user(User.builder().id(authenticatedUserId).build())
                .build();

        when(washCalendarRepository.findAllById(List.of(existingId, missingId)))
                .thenReturn(List.of(existing));

        assertThrows(
                ResponseStatusException.class,
                () -> service.deleteWashCalendars(
                        List.of(existingId, missingId),
                        authenticatedUserId
                )
        );
        verify(washCalendarRepository, never()).deleteAll(any());
    }

    @Test
    void batchDeleteRemovesAllAppointmentsWhenEveryRowIsOwned() {
        WashCalendarRepository washCalendarRepository = mock(WashCalendarRepository.class);
        UserService userService = mock(UserService.class);
        WashCalendarService service =
                new WashCalendarService(washCalendarRepository, userService);

        UUID authenticatedUserId = UUID.randomUUID();
        UUID firstId = UUID.randomUUID();
        UUID secondId = UUID.randomUUID();
        User owner = User.builder().id(authenticatedUserId).build();
        List<WashCalendar> appointments = List.of(
                WashCalendar.builder().id(firstId).user(owner).build(),
                WashCalendar.builder().id(secondId).user(owner).build()
        );

        when(washCalendarRepository.findAllById(List.of(firstId, secondId)))
                .thenReturn(appointments);

        service.deleteWashCalendars(List.of(firstId, secondId), authenticatedUserId);

        verify(washCalendarRepository).deleteAll(appointments);
    }

    @Test
    void tokenCancellationDeletesEveryRowWithTheMatchingTokenHash() {
        WashCalendarRepository washCalendarRepository = mock(WashCalendarRepository.class);
        UserService userService = mock(UserService.class);
        WashCalendarService service =
                new WashCalendarService(washCalendarRepository, userService);
        String token = "secure-cancellation-token";
        User user = User.builder()
                .id(UUID.randomUUID())
                .name("Customer")
                .email("customer@example.com")
                .build();
        LocalDateTime appointmentTime = LocalDateTime.of(2026, 6, 12, 10, 30);
        List<WashCalendar> appointments = List.of(
                WashCalendar.builder()
                        .id(UUID.randomUUID())
                        .user(user)
                        .washType(WashType.Interior_Treatment)
                        .localDateTime(appointmentTime)
                        .build(),
                WashCalendar.builder()
                        .id(UUID.randomUUID())
                        .user(user)
                        .washType(WashType.Exterior_Treatment)
                        .localDateTime(appointmentTime)
                        .build()
        );

        when(washCalendarRepository.findByCancellationTokenHash(any()))
                .thenReturn(appointments);
        when(userService.contactEmail(user)).thenReturn(user.getEmail());
        when(userService.isGuest(user)).thenReturn(false);

        service.deleteWashCalendarsByToken(token);

        verify(washCalendarRepository).findByCancellationTokenHash(any());
        verify(washCalendarRepository).deleteAll(appointments);
    }

    @Test
    void guestCancellationDeletesTheTemporaryUserAfterItsFinalAppointment() {
        WashCalendarRepository washCalendarRepository = mock(WashCalendarRepository.class);
        UserService userService = mock(UserService.class);
        WashCalendarService service =
                new WashCalendarService(washCalendarRepository, userService);
        User guest = User.builder()
                .id(UUID.randomUUID())
                .name("Guest Customer")
                .email("guest::customer@example.com")
                .build();
        List<WashCalendar> appointments = List.of(
                WashCalendar.builder()
                        .id(UUID.randomUUID())
                        .user(guest)
                        .washType(WashType.Interior_Treatment)
                        .localDateTime(LocalDateTime.of(2026, 6, 12, 10, 30))
                        .build(),
                WashCalendar.builder()
                        .id(UUID.randomUUID())
                        .user(guest)
                        .washType(WashType.Exterior_Treatment)
                        .localDateTime(LocalDateTime.of(2026, 6, 12, 10, 30))
                        .build()
        );

        when(washCalendarRepository.findByCancellationTokenHash(any()))
                .thenReturn(appointments);
        when(userService.contactEmail(guest)).thenReturn("customer@example.com");
        when(userService.isGuest(guest)).thenReturn(true);
        when(washCalendarRepository.countByUserAndIdNotIn(any(), any()))
                .thenReturn(0L);

        var cancellation = service.deleteWashCalendarsByToken("valid-token");

        assertEquals("customer@example.com", cancellation.customerEmail());
        assertEquals(true, cancellation.guestDeleted());
        verify(washCalendarRepository).deleteAll(appointments);
        verify(userService).deleteGuest(guest);
    }

    @Test
    void registeredCancellationNeverDeletesTheUser() {
        WashCalendarRepository washCalendarRepository = mock(WashCalendarRepository.class);
        UserService userService = mock(UserService.class);
        WashCalendarService service =
                new WashCalendarService(washCalendarRepository, userService);
        UUID userId = UUID.randomUUID();
        User registered = User.builder()
                .id(userId)
                .email("customer@example.com")
                .build();
        WashCalendar appointment = WashCalendar.builder()
                .id(UUID.randomUUID())
                .user(registered)
                .washType(WashType.Total_Treatment)
                .localDateTime(LocalDateTime.of(2026, 6, 12, 10, 30))
                .build();

        when(washCalendarRepository.findAllById(List.of(appointment.getId())))
                .thenReturn(List.of(appointment));
        when(userService.contactEmail(registered)).thenReturn("customer@example.com");
        when(userService.isGuest(registered)).thenReturn(false);

        var cancellation = service.deleteWashCalendars(
                List.of(appointment.getId()),
                userId
        );

        assertEquals(false, cancellation.guestDeleted());
        verify(userService, never()).deleteGuest(any());
    }

    @Test
    void tokenCancellationRejectsInvalidOrAlreadyUsedToken() {
        WashCalendarRepository washCalendarRepository = mock(WashCalendarRepository.class);
        UserService userService = mock(UserService.class);
        WashCalendarService service =
                new WashCalendarService(washCalendarRepository, userService);

        when(washCalendarRepository.findByCancellationTokenHash(any()))
                .thenReturn(List.of());

        assertThrows(
                ResponseStatusException.class,
                () -> service.deleteWashCalendarsByToken("invalid-token")
        );
        verify(washCalendarRepository, never()).deleteAll(any());
    }

    @Test
    void expiredCleanupDeletesRowsAndAnEmptyGuestAccount() {
        WashCalendarRepository washCalendarRepository = mock(WashCalendarRepository.class);
        UserService userService = mock(UserService.class);
        WashCalendarService service =
                new WashCalendarService(washCalendarRepository, userService);
        User guest = User.builder()
                .id(UUID.randomUUID())
                .email("guest::customer@example.com")
                .build();
        LocalDateTime cutoff = LocalDateTime.of(2026, 6, 12, 11, 0);
        List<WashCalendar> expired = List.of(
                WashCalendar.builder()
                        .id(UUID.randomUUID())
                        .user(guest)
                        .localDateTime(cutoff.minusMinutes(30))
                        .build(),
                WashCalendar.builder()
                        .id(UUID.randomUUID())
                        .user(guest)
                        .localDateTime(cutoff.minusMinutes(30))
                        .build()
        );

        when(washCalendarRepository.findByLocalDateTimeBefore(cutoff))
                .thenReturn(expired);
        when(userService.isGuest(guest)).thenReturn(true);
        when(washCalendarRepository.countByUser(guest)).thenReturn(0L);

        int deleted = service.deleteExpiredAppointments(cutoff);

        assertEquals(2, deleted);
        verify(washCalendarRepository).deleteAll(expired);
        verify(washCalendarRepository).flush();
        verify(userService).deleteGuest(guest);
    }

    @Test
    void expiredCleanupKeepsGuestWithFutureAppointments() {
        WashCalendarRepository washCalendarRepository = mock(WashCalendarRepository.class);
        UserService userService = mock(UserService.class);
        WashCalendarService service =
                new WashCalendarService(washCalendarRepository, userService);
        User guest = User.builder()
                .id(UUID.randomUUID())
                .email("guest::customer@example.com")
                .build();
        LocalDateTime cutoff = LocalDateTime.of(2026, 6, 12, 11, 0);
        List<WashCalendar> expired = List.of(
                WashCalendar.builder()
                        .id(UUID.randomUUID())
                        .user(guest)
                        .localDateTime(cutoff.minusMinutes(30))
                        .build()
        );

        when(washCalendarRepository.findByLocalDateTimeBefore(cutoff))
                .thenReturn(expired);
        when(userService.isGuest(guest)).thenReturn(true);
        when(washCalendarRepository.countByUser(guest)).thenReturn(1L);

        int deleted = service.deleteExpiredAppointments(cutoff);

        assertEquals(1, deleted);
        verify(userService, never()).deleteGuest(any());
    }

    @Test
    void expiredCleanupDoesNothingWhenNoAppointmentsHavePassed() {
        WashCalendarRepository washCalendarRepository = mock(WashCalendarRepository.class);
        WashCalendarService service =
                new WashCalendarService(washCalendarRepository, mock(UserService.class));
        LocalDateTime cutoff = LocalDateTime.of(2026, 6, 12, 11, 0);

        when(washCalendarRepository.findByLocalDateTimeBefore(cutoff))
                .thenReturn(List.of());

        assertEquals(0, service.deleteExpiredAppointments(cutoff));
        verify(washCalendarRepository, never()).deleteAll(any());
        verify(washCalendarRepository, never()).flush();
    }
}
