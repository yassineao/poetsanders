package Gloyoo.AutoAnders.user.service;

import Gloyoo.AutoAnders.user.dto.AdminDashboardResponse;
import Gloyoo.AutoAnders.user.entity.Role;
import Gloyoo.AutoAnders.user.entity.User;
import Gloyoo.AutoAnders.user.repository.UserRepository;
import Gloyoo.AutoAnders.washCalendar.entity.WashCalendar;
import Gloyoo.AutoAnders.washCalendar.entity.WashType;
import Gloyoo.AutoAnders.washCalendar.repository.WashCalendarRepository;
import org.junit.jupiter.api.Test;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class AdminDashboardServiceTest {

    @Test
    void dashboardReturnsPasswordSafeUsersAndAppointmentTotals() {
        UserRepository userRepository = mock(UserRepository.class);
        WashCalendarRepository washCalendarRepository = mock(WashCalendarRepository.class);
        AdminDashboardService service =
                new AdminDashboardService(userRepository, washCalendarRepository);

        User user = User.builder()
                .id(UUID.randomUUID())
                .name("Customer")
                .email("customer@example.com")
                .phoneNumber("+31 6 12345678")
                .password("hashed-password")
                .role(Role.USER)
                .createdAt(Instant.parse("2026-06-01T10:00:00Z"))
                .updatedAt(Instant.parse("2026-06-01T10:00:00Z"))
                .build();
        WashCalendar pending = WashCalendar.builder()
                .id(UUID.randomUUID())
                .washType(WashType.Interior_Treatment)
                .localDateTime(LocalDateTime.of(2026, 6, 10, 10, 0))
                .accepted(false)
                .user(user)
                .build();
        WashCalendar accepted = WashCalendar.builder()
                .id(UUID.randomUUID())
                .washType(WashType.Exterior_Treatment)
                .localDateTime(LocalDateTime.of(2026, 6, 11, 11, 0))
                .accepted(true)
                .user(user)
                .build();

        when(userRepository.findAll()).thenReturn(List.of(user));
        when(washCalendarRepository.findAll()).thenReturn(List.of(pending, accepted));

        AdminDashboardResponse dashboard = service.getDashboard();

        assertEquals(1, dashboard.totalUsers());
        assertEquals(2, dashboard.totalAppointments());
        assertEquals(1, dashboard.pendingAppointments());
        assertEquals(1, dashboard.acceptedAppointments());
        assertEquals("customer@example.com", dashboard.users().getFirst().email());
        assertEquals("Customer", dashboard.appointments().getFirst().customerName());
    }
}
