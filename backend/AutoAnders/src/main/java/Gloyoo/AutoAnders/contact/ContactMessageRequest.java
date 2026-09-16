package Gloyoo.AutoAnders.contact;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ContactMessageRequest(
        @NotBlank(message = "Vehicle or topic is required")
        @Size(max = 120, message = "Vehicle or topic must be 120 characters or fewer")
        String companyName,

        @Size(max = 80, message = "Phone number must be 80 characters or fewer")
        String phoneNumber,

        @NotBlank(message = "Message is required")
        @Size(max = 5000, message = "Message must be 5000 characters or fewer")
        String message
) {
}
