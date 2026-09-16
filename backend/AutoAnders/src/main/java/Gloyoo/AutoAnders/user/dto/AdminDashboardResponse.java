package Gloyoo.AutoAnders.user.dto;

import Gloyoo.AutoAnders.contact.AdminContactMessageResponse;

import java.util.List;

public record AdminDashboardResponse(
        long totalUsers,
        long totalAppointments,
        long pendingAppointments,
        long acceptedAppointments,
        List<AdminUserResponse> users,
        List<AdminAppointmentResponse> appointments,
        List<AdminContactMessageResponse> contactMessages
) {
}
