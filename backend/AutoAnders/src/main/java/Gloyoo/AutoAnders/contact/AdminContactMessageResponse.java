package Gloyoo.AutoAnders.contact;

import java.time.Instant;
import java.util.UUID;

public record AdminContactMessageResponse(
        UUID id,
        String companyName,
        UUID userId,
        String customerName,
        String email,
        String phoneNumber,
        String message,
        ContactMessageStatus status,
        boolean emailDelivered,
        String emailError,
        String adminReply,
        Instant repliedAt,
        Instant createdAt,
        Instant updatedAt
) {
    public static AdminContactMessageResponse from(ContactMessage message) {
        var user = message.getUser();
        return new AdminContactMessageResponse(
                message.getId(),
                message.getCompanyName(),
                user != null ? user.getId() : null,
                user != null ? user.getName() : "Legacy contact",
                user != null ? user.getEmail() : "",
                message.getPhoneNumber() != null
                        ? message.getPhoneNumber()
                        : user != null ? user.getPhoneNumber() : null,
                message.getMessage(),
                message.getStatus(),
                message.isEmailDelivered(),
                message.getEmailError(),
                message.getAdminReply(),
                message.getRepliedAt(),
                message.getCreatedAt(),
                message.getUpdatedAt()
        );
    }
}
