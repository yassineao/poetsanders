package Gloyoo.AutoAnders.storage.service;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.UUID;

@Service
public class SupaBasePictureStorage {
    private final RestClient restClient;

    @Value("${supabase.url}")
    private String supabaseUrl;

    @Value("${supabase.service-role-key}")
    private String serviceRoleKey;

    @Value("${supabase.storage.bucket}")
    private String bucket;

    public SupaBasePictureStorage(RestClient.Builder builder) {
        this.restClient = builder.build();
    }

    public String uploadCarPicture(UUID carId, MultipartFile file) {
        try {
            String originalFilename = file.getOriginalFilename();
            String extension = getExtension(originalFilename);

            String path = "cars/" + carId + "/" + UUID.randomUUID() + extension;

            String uploadUrl = supabaseUrl
                    + "/storage/v1/object/"
                    + bucket
                    + "/"
                    + path;

            restClient.post()
                    .uri(uploadUrl)
                    .header(HttpHeaders.AUTHORIZATION, "Bearer " + serviceRoleKey)
                    .header("apikey", serviceRoleKey)
                    .header(HttpHeaders.CONTENT_TYPE, file.getContentType())
                    .header("x-upsert", "false")
                    .body(file.getBytes())
                    .retrieve()
                    .toBodilessEntity();

            return path;

        } catch (IOException e) {
            throw new RuntimeException("Could not upload file", e);
        }
    }

    public String getPublicUrl(String storagePath) {
        return supabaseUrl
                + "/storage/v1/object/public/"
                + bucket
                + "/"
                + storagePath;
    }

    private String getExtension(String filename) {
        if (filename == null || !filename.contains(".")) {
            return ".jpg";
        }

        return filename.substring(filename.lastIndexOf("."));
    }
}
