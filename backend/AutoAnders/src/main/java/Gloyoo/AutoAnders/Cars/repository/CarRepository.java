package Gloyoo.AutoAnders.Cars.repository;

import Gloyoo.AutoAnders.Cars.entity.Car;
import Gloyoo.AutoAnders.Cars.entity.Status;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;


@Repository
public interface CarRepository extends JpaRepository<Car, UUID> {
    boolean existsByLicensePlate(String licensePlate);

    List<Car> findByUserId(UUID userId);
}
