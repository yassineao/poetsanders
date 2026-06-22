package Gloyoo.AutoAnders.CarPictures.service;

import Gloyoo.AutoAnders.CarPictures.entity.CarPicture;
import Gloyoo.AutoAnders.CarPictures.repository.CarPictureRepository;
import Gloyoo.AutoAnders.Cars.entity.Car;
import Gloyoo.AutoAnders.Cars.repository.CarRepository;
import Gloyoo.AutoAnders.storage.service.SupaBasePictureStorage;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@Service
public class CarPictureService {

    private final CarRepository carRepository;
    private final CarPictureRepository carPictureRepository;
    private final SupaBasePictureStorage storageService;

    public CarPictureService(
            CarRepository carRepository,
            CarPictureRepository carPictureRepository,
            SupaBasePictureStorage storageService
    ) {
        this.carRepository = carRepository;
        this.carPictureRepository = carPictureRepository;
        this.storageService = storageService;
    }

    public CarPicture addPictureToCar(
            UUID carId,
            MultipartFile file,
            String title,
            String description,
            int width,
            int height
    ) {
        Car car = carRepository.findById(carId)
                .orElseThrow(() -> new IllegalArgumentException("Car not found"));

        String storage_path = storageService.uploadCarPicture(carId, file);

        CarPicture picture = CarPicture.builder()
                .car(car)
                .storage_path(storage_path)
                .title(defaultText(title))
                .description(defaultText(description))
                .width(width)
                .height(height)
                .build();

        return carPictureRepository.save(picture);
    }

    public List<CarPicture> addPicturesToCar(
            UUID carId,
            List<MultipartFile> files,
            int width,
            int height
    ) {
        if (files == null || files.isEmpty()) {
            throw new IllegalArgumentException("At least one picture is required");
        }

        Car car = carRepository.findById(carId)
                .orElseThrow(() -> new IllegalArgumentException("Car not found"));

        List<CarPicture> pictures = files.stream()
                .filter(file -> file != null && !file.isEmpty())
                .map(file -> {
                    String storagePath = storageService.uploadCarPicture(carId, file);
                    String filename = defaultText(file.getOriginalFilename());

                    return CarPicture.builder()
                            .car(car)
                            .storage_path(storagePath)
                            .title(filename)
                            .description(filename)
                            .width(width)
                            .height(height)
                            .build();
                })
                .toList();

        if (pictures.isEmpty()) {
            throw new IllegalArgumentException("At least one picture is required");
        }

        return carPictureRepository.saveAll(pictures);
    }

    public List<CarPicture> getAllCarPicturesByCarId(UUID carId ) {
        return carPictureRepository.findByCarId(carId).stream()
                .peek(this::resolvePictureUrl)
                .toList();
    }

    private void resolvePictureUrl(CarPicture picture) {
        picture.setStorage_path(storageService.resolvePublicUrl(picture.getStorage_path()));
    }

    private String defaultText(String value) {
        return value == null ? "" : value;
    }
}
