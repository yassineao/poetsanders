package Gloyoo.AutoAnders.CarPictures.controller;

import Gloyoo.AutoAnders.CarPictures.dto.CarPictureRequest;
import Gloyoo.AutoAnders.CarPictures.entity.CarPicture;
import Gloyoo.AutoAnders.CarPictures.service.CarPictureService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/cars/{carId}/pictures")
public class CarPictureController {

    private final CarPictureService carPictureService;

    public CarPictureController(CarPictureService carPictureService) {
        this.carPictureService = carPictureService;
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<CarPicture> uploadPicture(
            @PathVariable UUID carId,
            @ModelAttribute CarPictureRequest carPictureRequest,
            Authentication authentication
    ) {
        CarPicture picture = carPictureService.addPictureToCar(
                carId,
                carPictureRequest.file(),
                carPictureRequest.title(),
                carPictureRequest.description(),
                carPictureRequest.width(),
                carPictureRequest.height(),
                authenticatedUserId(authentication),
                authenticatedRole(authentication)


        );

        return ResponseEntity.ok(picture);
    }

    @PostMapping(path = "/batch", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<List<CarPicture>> uploadPictures(
            @PathVariable UUID carId,
            @RequestParam("files") List<org.springframework.web.multipart.MultipartFile> files,
            @RequestParam(required = false, defaultValue = "0") int width,
            @RequestParam(required = false, defaultValue = "0") int height,
            Authentication authentication
    ) {
        List<CarPicture> pictures = carPictureService.addPicturesToCar(
                carId,
                files,
                width,
                height,
                authenticatedUserId(authentication),
                authenticatedRole(authentication)
        );

        return ResponseEntity.ok(pictures);
    }

    @GetMapping
    public ResponseEntity<List<CarPicture>> getAllCarPictures(@PathVariable UUID carId) {
        List <CarPicture> carPictures = carPictureService.getAllCarPicturesByCarId(carId);
        return ResponseEntity.ok().body(carPictures);
    }

    @DeleteMapping("/{pictureId}")
    public ResponseEntity<Void> deletePicture(
            @PathVariable UUID carId,
            @PathVariable UUID pictureId,
            Authentication authentication
    ) {
        carPictureService.deletePictureFromCar(
                carId,
                pictureId,
                authenticatedUserId(authentication),
                authenticatedRole(authentication)
        );
        return ResponseEntity.noContent().build();
    }

    private UUID authenticatedUserId(Authentication authentication) {
        if (authentication == null || !(authentication.getDetails() instanceof Map<?, ?> details)) {
            throw new IllegalArgumentException("Not authenticated");
        }

        Object uid = details.get("uid");
        if (uid == null) {
            throw new IllegalArgumentException("User ID missing");
        }

        return UUID.fromString(uid.toString());
    }

    private String authenticatedRole(Authentication authentication) {
        if (authentication == null || !(authentication.getDetails() instanceof Map<?, ?> details)) {
            throw new IllegalArgumentException("Not authenticated");
        }
        Object role = details.get("role");
        return role == null ? "" : role.toString();
    }
}
