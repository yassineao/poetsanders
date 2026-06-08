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
                .title(title)
                .description(description)
                .width(width)
                .height(height)
                .build();

        return carPictureRepository.save(picture);
    }

    public List<CarPicture> getAllCarPicturesByCarId(UUID carId ) {
        return carPictureRepository.findByCarId(carId);
    }
}