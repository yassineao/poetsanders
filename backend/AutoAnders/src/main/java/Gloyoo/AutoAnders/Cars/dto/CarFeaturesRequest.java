package Gloyoo.AutoAnders.Cars.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.List;

public record CarFeaturesRequest(
        @NotNull List<@NotBlank @Size(max = 255) String> features
) {
}
