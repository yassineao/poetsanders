package Gloyoo.AutoAnders.contact;

import java.time.Instant;
import java.util.UUID;

public record UserContactMessageResponse(
        UUID id,
        String companyName,
        String phoneNumber,
        String message,
        ContactMessageStatus status,
        String adminReply,
        Instant repliedAt,
        Instant createdAt,
        Instant updatedAt
) {
    public static UserContactMessageResponse from(ContactMessage message) {
        return new UserContactMessageResponse(
                message.getId(),
                message.getCompanyName(),
                message.getPhoneNumber(),
                message.getMessage(),
                message.getStatus(),
                message.getAdminReply(),
                message.getRepliedAt(),
                message.getCreatedAt(),
                message.getUpdatedAt()
        );
    }
}
