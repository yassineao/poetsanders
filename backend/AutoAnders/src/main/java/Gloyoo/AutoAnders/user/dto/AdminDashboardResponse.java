package Gloyoo.AutoAnders.user.dto;

import java.util.List;

public record AdminDashboardResponse(
        long totalUsers,
        long totalAppointments,
        long pendingAppointments,
        long acceptedAppointments,
        List<AdminUserResponse> users,
        List<AdminAppointmentResponse> appointments
) {
}
