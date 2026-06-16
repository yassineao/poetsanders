package Gloyoo.AutoAnders.Cars.dto;

import com.fasterxml.jackson.annotation.JsonAlias;

public record CarPictureMetadataRequest(
        @JsonAlias("storage_path")
        String storagePath,
        String title,
        String description,
        Integer width,
        Integer height
) {}
