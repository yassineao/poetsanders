package Gloyoo.AutoAnders.user.service;

import Gloyoo.AutoAnders.user.dto.AdminAppointmentResponse;
import Gloyoo.AutoAnders.user.dto.AdminDashboardResponse;
import Gloyoo.AutoAnders.user.dto.AdminUserResponse;
import Gloyoo.AutoAnders.user.repository.UserRepository;
import Gloyoo.AutoAnders.washCalendar.repository.WashCalendarRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;

@Service
public class AdminDashboardService {

    private final UserRepository userRepository;
    private final WashCalendarRepository washCalendarRepository;

    public AdminDashboardService(
            UserRepository userRepository,
            WashCalendarRepository washCalendarRepository
    ) {
        this.userRepository = userRepository;
        this.washCalendarRepository = washCalendarRepository;
    }

    @Transactional(readOnly = true)
    public AdminDashboardResponse getDashboard() {
        List<AdminUserResponse> users = userRepository.findAll().stream()
                .sorted(Comparator.comparing(
                        user -> user.getCreatedAt(),
                        Comparator.nullsLast(Comparator.reverseOrder())
                ))
                .map(AdminUserResponse::from)
                .toList();

        List<AdminAppointmentResponse> appointments = washCalendarRepository.findAll().stream()
                .sorted(Comparator.comparing(
                        appointment -> appointment.getLocalDateTime(),
                        Comparator.reverseOrder()
                ))
                .map(AdminAppointmentResponse::from)
                .toList();

        long acceptedAppointments = appointments.stream()
                .filter(AdminAppointmentResponse::accepted)
                .count();

        return new AdminDashboardResponse(
                users.size(),
                appointments.size(),
                appointments.size() - acceptedAppointments,
                acceptedAppointments,
                users,
                appointments
        );
    }
}
