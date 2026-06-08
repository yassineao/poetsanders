package Gloyoo.AutoAnders.CarPictures.repository;

import Gloyoo.AutoAnders.CarPictures.entity.CarPicture;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface CarPictureRepository extends JpaRepository<CarPicture, Long> {
    List<CarPicture> findByCarId(UUID carId);
}
