package Gloyoo.AutoAnders.CarPictures.dto;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

public record CarPictureRequest (@PathVariable UUID carId,
                                 @RequestParam("file") MultipartFile file,
                                 @RequestParam(required = false) String title,
                                 @RequestParam(required = false) String description,
                                 @RequestParam(required = true) int width,
                                 @RequestParam(required = true) int height

) {
}
