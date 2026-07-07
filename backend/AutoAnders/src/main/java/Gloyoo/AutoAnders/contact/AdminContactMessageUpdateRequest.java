package Gloyoo.AutoAnders.contact;

import jakarta.validation.constraints.NotNull;

public record AdminContactMessageUpdateRequest(
        @NotNull(message = "Status is required")
        ContactMessageStatus status,

        String adminReply
) {
}
