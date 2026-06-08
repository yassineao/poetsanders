package Gloyoo.AutoAnders.Cars.entity;

import Gloyoo.AutoAnders.CarPictures.entity.CarPicture;
import Gloyoo.AutoAnders.user.entity.User;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "cars",
        uniqueConstraints = {
                @UniqueConstraint(name = "uk_cars_license_plate", columnNames = "license_plate")
        }
)

public class Car {
    @GeneratedValue(strategy = GenerationType.UUID)
    @Id
    UUID id;


    private String title;
    private String subtitle;

    private Integer yearOfManufacture;
    private Integer mileage;
    private String power;
    private String referenceNumber;
    private BigDecimal price;

    private LocalDate firstRegistrationDate;
    private Integer numberOfDoors;
    private Integer wheelbase;
    private Integer numberOfCylinders;
    private String motorVehicleTax;
    private LocalDate modelDateFrom;
    private LocalDate modelDateTo;
    private Integer maxTowingWeight;
    private Integer maxTowingWeightUnbraked;
    private BigDecimal urbanFuelConsumption;
    private BigDecimal combinedFuelConsumption;
    private BigDecimal motorwayFuelConsumption;
    private Integer co2Emissions;
    private Boolean taxDeductible;
    private String chassisNumber;
    private Integer numberOfKeys;

    @Column(name = "license_plate", unique = true)
    private String licensePlate;
    private Integer engineDisplacement;
    private String colour;
    private Integer emptyWeight;
    private Integer taxAdditionPercentage;
    private String apkMotDate;
    private Boolean serviceDocumentation;
    private String location;

    private BigDecimal financialLeasePricePerMonth;
    private BigDecimal leasePrice60Months;
    private BigDecimal leasePrice48Months;
    private BigDecimal leasePrice36Months;

    @Enumerated(EnumType.STRING)
    private BodyType bodyType;

    @Enumerated(EnumType.STRING)
    private Gearbox gearbox;

    @Enumerated(EnumType.STRING)
    private Fuel fuel;

    @Enumerated(EnumType.STRING)
    private EmissionClass emissionClass;

    @Enumerated(EnumType.STRING)
    private EnergyLabel energyLabel;

    @Enumerated(EnumType.STRING)
    private PaintType paintType;

    @Enumerated(EnumType.STRING)
    private Upholstery upholstery;

    @Enumerated(EnumType.STRING)
    private Status status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @OneToMany(mappedBy = "car", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CarPicture> pictures = new ArrayList<>();



}
