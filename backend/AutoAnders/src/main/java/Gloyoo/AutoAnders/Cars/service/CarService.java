package Gloyoo.AutoAnders.Cars.service;

import Gloyoo.AutoAnders.CarPictures.entity.CarPicture;
import Gloyoo.AutoAnders.Cars.dto.CarRequest;
import Gloyoo.AutoAnders.Cars.entity.*;
import Gloyoo.AutoAnders.Cars.repository.CarRepository;

import Gloyoo.AutoAnders.user.entity.User;
import Gloyoo.AutoAnders.user.repository.UserRepository;
import Gloyoo.AutoAnders.storage.service.SupaBasePictureStorage;
import jakarta.validation.constraints.NotNull;
import org.springframework.stereotype.Service;


import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Objects;
import java.util.UUID;

@Service
public class CarService {
    private final CarRepository carRepository;
    private final UserRepository userRepository;
    private final SupaBasePictureStorage pictureStorage;

    public CarService(
            CarRepository carRepository,
            UserRepository userRepository,
            SupaBasePictureStorage pictureStorage
    ) {
        this.carRepository = carRepository;
        this.userRepository = userRepository;
        this.pictureStorage = pictureStorage;
    }

    public Car addCar(@NotNull CarRequest carRequest, @NotNull UUID userId) {
        String licensePlate = normalizeOptional(carRequest.licensePlate());
        if (licensePlate != null && carRepository.existsByLicensePlate(licensePlate)) {
            throw new IllegalArgumentException("Car already exists with this license plate");
        }
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Car car = Car.builder()
                .brand(carRequest.brand())
                .model(carRequest.model())
                .title(carRequest.title())
                .subtitle(carRequest.subtitle())
                .yearOfManufacture(carRequest.yearOfManufacture())
                .mileage(carRequest.mileage())
                .power(carRequest.power())
                .referenceNumber(carRequest.referenceNumber())
                .price(carRequest.price())
                .firstRegistrationDate(carRequest.firstRegistrationDate())
                .numberOfDoors(carRequest.numberOfDoors())
                .wheelbase(carRequest.wheelbase())
                .numberOfCylinders(carRequest.numberOfCylinders())
                .motorVehicleTax(carRequest.motorVehicleTax())
                .modelDateFrom(carRequest.modelDateFrom())
                .modelDateTo(carRequest.modelDateTo())
                .maxTowingWeight(carRequest.maxTowingWeight())
                .maxTowingWeightUnbraked(carRequest.maxTowingWeightUnbraked())
                .urbanFuelConsumption(carRequest.urbanFuelConsumption())
                .combinedFuelConsumption(carRequest.combinedFuelConsumption())
                .motorwayFuelConsumption(carRequest.motorwayFuelConsumption())
                .co2Emissions(carRequest.co2Emissions())
                .taxDeductible(carRequest.taxDeductible())
                .chassisNumber(carRequest.chassisNumber())
                .numberOfKeys(carRequest.numberOfKeys())
                .licensePlate(licensePlate)
                .engineDisplacement(carRequest.engineDisplacement())
                .colour(carRequest.colour())
                .emptyWeight(carRequest.emptyWeight())
                .taxAdditionPercentage(carRequest.taxAdditionPercentage())
                .apkMotDate(carRequest.apkMotDate())
                .serviceDocumentation(carRequest.serviceDocumentation())
                .location(carRequest.location())
                .financialLeasePricePerMonth(carRequest.financialLeasePricePerMonth())
                .leasePrice60Months(carRequest.leasePrice60Months())
                .leasePrice48Months(carRequest.leasePrice48Months())
                .leasePrice36Months(carRequest.leasePrice36Months())
                .bodyType(carRequest.bodyType())
                .gearbox(carRequest.gearbox())
                .fuel(carRequest.fuel())
                .emissionClass(carRequest.emissionClass())
                .energyLabel(carRequest.energyLabel())
                .paintType(carRequest.paintType())
                .upholstery(carRequest.upholstery())
                .status(carRequest.status())
                .user(user)
                .pictures(new ArrayList<>())
                .build();

        addPicturesFromRequest(car, carRequest);

        return carRepository.save(car);
    }

    public Car updateCar(@NotNull CarRequest carRequest,@NotNull UUID id) {
        Car car = carRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Car not found"));

        String licensePlate = normalizeOptional(carRequest.licensePlate());
        if (!Objects.equals(car.getLicensePlate(), licensePlate)
                && licensePlate != null
                && carRepository.existsByLicensePlate(licensePlate)) {
            throw new IllegalArgumentException("Car already exists with this license plate");
        }

        car.setBrand(carRequest.brand());
        car.setModel(carRequest.model());
        car.setTitle(carRequest.title());
        car.setSubtitle(carRequest.subtitle());
        car.setYearOfManufacture(carRequest.yearOfManufacture());
        car.setMileage(carRequest.mileage());
        car.setPower(carRequest.power());
        car.setReferenceNumber(carRequest.referenceNumber());
        car.setPrice(carRequest.price());
        car.setFirstRegistrationDate(carRequest.firstRegistrationDate());
        car.setNumberOfDoors(carRequest.numberOfDoors());
        car.setWheelbase(carRequest.wheelbase());
        car.setNumberOfCylinders(carRequest.numberOfCylinders());
        car.setMotorVehicleTax(carRequest.motorVehicleTax());
        car.setModelDateFrom(carRequest.modelDateFrom());
        car.setModelDateTo(carRequest.modelDateTo());
        car.setMaxTowingWeight(carRequest.maxTowingWeight());
        car.setMaxTowingWeightUnbraked(carRequest.maxTowingWeightUnbraked());
        car.setUrbanFuelConsumption(carRequest.urbanFuelConsumption());
        car.setCombinedFuelConsumption(carRequest.combinedFuelConsumption());
        car.setMotorwayFuelConsumption(carRequest.motorwayFuelConsumption());
        car.setCo2Emissions(carRequest.co2Emissions());
        car.setTaxDeductible(carRequest.taxDeductible());
        car.setChassisNumber(carRequest.chassisNumber());
        car.setNumberOfKeys(carRequest.numberOfKeys());
        car.setLicensePlate(licensePlate);
        car.setEngineDisplacement(carRequest.engineDisplacement());
        car.setColour(carRequest.colour());
        car.setEmptyWeight(carRequest.emptyWeight());
        car.setTaxAdditionPercentage(carRequest.taxAdditionPercentage());
        car.setApkMotDate(carRequest.apkMotDate());
        car.setServiceDocumentation(carRequest.serviceDocumentation());
        car.setLocation(carRequest.location());
        car.setFinancialLeasePricePerMonth(carRequest.financialLeasePricePerMonth());
        car.setLeasePrice60Months(carRequest.leasePrice60Months());
        car.setLeasePrice48Months(carRequest.leasePrice48Months());
        car.setLeasePrice36Months(carRequest.leasePrice36Months());
        car.setBodyType(carRequest.bodyType());
        car.setGearbox(carRequest.gearbox());
        car.setFuel(carRequest.fuel());
        car.setEmissionClass(carRequest.emissionClass());
        car.setEnergyLabel(carRequest.energyLabel());
        car.setPaintType(carRequest.paintType());
        car.setUpholstery(carRequest.upholstery());
        car.setStatus(carRequest.status());

        return carRepository.save(car);
    }

    public void deleteCar(UUID id) {
        Car car = carRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Car not found"));
        carRepository.deleteById(car.getId());
    }

    public List<Car> findAllCars() {
        return carRepository.findAll().stream()
                .peek(this::resolvePictureUrls)
                .toList();
    }

    public Optional<Car> findCarById(UUID id) {
        Car car = carRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Car not found"));
        resolvePictureUrls(car);
        return Optional.of(car);
    }

    public List<Car> findCarByUser(UUID id){
        List<Car> cars = carRepository.findByUserId(id);
        cars.forEach(this::resolvePictureUrls);
        return cars;
    }

    public Car updateCarStatus(UUID id, Status status) {
        Car car = carRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Car not found"));
        car.setStatus(status);
        carRepository.save(car);
        return car;
    }

    private void addPicturesFromRequest(Car car, CarRequest carRequest) {
        if (carRequest.pictures() == null || carRequest.pictures().isEmpty()) {
            return;
        }

        carRequest.pictures().stream()
                .filter(picture -> picture.storagePath() != null && !picture.storagePath().isBlank())
                .map(picture -> CarPicture.builder()
                        .car(car)
                        .storage_path(picture.storagePath())
                        .title(defaultText(picture.title()))
                        .description(defaultText(picture.description()))
                        .width(defaultNumber(picture.width()))
                        .height(defaultNumber(picture.height()))
                        .build())
                .forEach(car.getPictures()::add);
    }

    private String defaultText(String value) {
        return value == null ? "" : value;
    }

    private Integer defaultNumber(Integer value) {
        return value == null ? 0 : value;
    }

    private String normalizeOptional(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }

    private void resolvePictureUrls(Car car) {
        car.getPictures().forEach(picture ->
                picture.setStorage_path(pictureStorage.resolvePublicUrl(picture.getStorage_path()))
        );
    }

}
