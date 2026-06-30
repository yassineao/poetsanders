package Gloyoo.AutoAnders.storage.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;
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

    public String resolveAccessibleUrl(String storagePath) {
        if (storagePath == null || storagePath.isBlank()) {
            return storagePath;
        }

        String objectPath = resolveObjectPath(storagePath);
        if (objectPath == null || objectPath.isBlank()) {
            return storagePath;
        }

        return createSignedUrl(objectPath);
    }

    public void deleteCarPicture(String storagePath) {
        String objectPath = resolveObjectPath(storagePath);

        if (objectPath == null || objectPath.isBlank()) {
            return;
        }

        String deleteUrl = supabaseUrl
                + "/storage/v1/object/"
                + bucket
                + "/"
                + objectPath;

        restClient.delete()
                .uri(deleteUrl)
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + serviceRoleKey)
                .header("apikey", serviceRoleKey)
                .retrieve()
                .toBodilessEntity();
    }

    private String getExtension(String filename) {
        if (filename == null || !filename.contains(".")) {
            return ".jpg";
        }

        return filename.substring(filename.lastIndexOf("."));
    }

    private String createSignedUrl(String objectPath) {
        String signUrl = supabaseUrl
                + "/storage/v1/object/sign/"
                + bucket
                + "/"
                + objectPath;

        @SuppressWarnings("unchecked")
        Map<String, Object> response = restClient.post()
                .uri(signUrl)
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + serviceRoleKey)
                .header("apikey", serviceRoleKey)
                .contentType(MediaType.APPLICATION_JSON)
                .body(Map.of("expiresIn", 3600))
                .retrieve()
                .body(Map.class);

        Object signedUrl = response == null ? null : response.get("signedURL");
        if (signedUrl == null) {
            signedUrl = response == null ? null : response.get("signedUrl");
        }

        if (signedUrl == null || signedUrl.toString().isBlank()) {
            return getPublicUrl(objectPath);
        }

        String value = signedUrl.toString();
        if (value.startsWith("http://") || value.startsWith("https://")) {
            return value;
        }

        return supabaseUrl + "/storage/v1" + (value.startsWith("/") ? value : "/" + value);
    }

    private String resolveObjectPath(String storagePath) {
        if (storagePath == null || storagePath.isBlank()) {
            return null;
        }

        String publicPrefix = supabaseUrl
                + "/storage/v1/object/public/"
                + bucket
                + "/";

        String objectPrefix = supabaseUrl
                + "/storage/v1/object/"
                + bucket
                + "/";

        if (storagePath.startsWith(publicPrefix)) {
            return storagePath.substring(publicPrefix.length());
        }

        if (storagePath.startsWith(objectPrefix)) {
            return storagePath.substring(objectPrefix.length());
        }

        return storagePath;
    }
}
