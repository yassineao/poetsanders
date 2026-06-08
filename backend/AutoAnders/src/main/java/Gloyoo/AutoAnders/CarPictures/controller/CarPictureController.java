package Gloyoo.AutoAnders.CarPictures.controller;

import Gloyoo.AutoAnders.CarPictures.dto.CarPictureRequest;
import Gloyoo.AutoAnders.CarPictures.entity.CarPicture;
import Gloyoo.AutoAnders.CarPictures.service.CarPictureService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
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
            @ModelAttribute CarPictureRequest carPictureRequest
    ) {
        CarPicture picture = carPictureService.addPictureToCar(
                carId,
                carPictureRequest.file(),
                carPictureRequest.title(),
                carPictureRequest.description(),
                carPictureRequest.width(),
                carPictureRequest.height()


        );

        return ResponseEntity.ok(picture);
    }

    @GetMapping
    public ResponseEntity<List<CarPicture>> getAllCarPictures(@PathVariable UUID carId) {
        List <CarPicture> carPictures = carPictureService.getAllCarPicturesByCarId(carId);
        return ResponseEntity.ok().body(carPictures);
    }
}