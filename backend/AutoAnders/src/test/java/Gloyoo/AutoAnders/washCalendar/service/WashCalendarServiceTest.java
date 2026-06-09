package Gloyoo.AutoAnders.washCalendar.service;

import Gloyoo.AutoAnders.user.entity.User;
import Gloyoo.AutoAnders.user.service.UserService;
import Gloyoo.AutoAnders.washCalendar.dto.WashCalendarRequest;
import Gloyoo.AutoAnders.washCalendar.entity.WashCalendar;
import Gloyoo.AutoAnders.washCalendar.entity.WashType;
import Gloyoo.AutoAnders.washCalendar.repository.WashCalendarRepository;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertSame;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
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
}
