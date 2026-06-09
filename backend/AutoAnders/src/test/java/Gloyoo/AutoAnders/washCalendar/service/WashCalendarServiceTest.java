package Gloyoo.AutoAnders.washCalendar.service;

import Gloyoo.AutoAnders.user.entity.User;
import Gloyoo.AutoAnders.user.service.UserService;
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
        });
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
}
