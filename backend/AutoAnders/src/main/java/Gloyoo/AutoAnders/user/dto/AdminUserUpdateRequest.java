package Gloyoo.AutoAnders.user.dto;

import Gloyoo.AutoAnders.user.entity.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record AdminUserUpdateRequest(
        @NotBlank @Size(max = 255) String name,
        @NotBlank @Email @Size(max = 255) String email,
        @Size(max = 30) String phoneNumber,
        @NotNull Role role
) {
}
