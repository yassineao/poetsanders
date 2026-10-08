package Gloyoo.AutoAnders.Cars.entity;

import Gloyoo.AutoAnders.CarPictures.entity.CarPicture;
import Gloyoo.AutoAnders.user.entity.User;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@ToString(onlyExplicitlyIncluded = true)
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "cars", indexes = {
                @Index(name = "idx_cars_brand_model", columnList = "brand, model"),
                @Index(name = "idx_cars_status", columnList = "status"),
                @Index(name = "idx_cars_price", columnList = "price"),
                @Index(name = "idx_cars_user_id", columnList = "user_id"),
                @Index(name = "idx_cars_vin", columnList = "vin")
}, uniqueConstraints = {
                @UniqueConstraint(name = "uk_cars_license_plate", columnNames = "license_plate")
})

public class Car {
        @GeneratedValue(strategy = GenerationType.UUID)
        @Id
        @ToString.Include
        private UUID id;

        @Version
        private Long version;

        @CreationTimestamp
        @JdbcTypeCode(SqlTypes.TIMESTAMP)
        @Column(nullable = false, updatable = false)
        private Instant createdAt;

        @UpdateTimestamp
        @JdbcTypeCode(SqlTypes.TIMESTAMP)
        @Column(nullable = false)
        private Instant updatedAt;
        
        @Column(nullable = false)
        private String brand;

        @Column(nullable = false)
        private String model;

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
        @Column(name = "co2_emissions")
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
        @Column(name = "lease_price_60_months")
        private BigDecimal leasePrice60Months;
        @Column(name = "lease_price_48_months")
        private BigDecimal leasePrice48Months;
        @Column(name = "lease_price_36_months")
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

        private String variant;

        private String trimLevel;

        @Size(max = 17)
        @Column(length = 17)
        private String vin;

        @PositiveOrZero
        @Column(precision = 12, scale = 2)
        private BigDecimal originalPrice;

        @PositiveOrZero
        @Column(precision = 12, scale = 2)
        private BigDecimal discountAmount;

        private String taxScheme;

        private LocalDate lastServiceDate;

        private LocalDate warrantyUntil;

        private Boolean accidentFree;

        private Boolean imported;

        @PositiveOrZero
        private Integer numberOfPreviousOwners;

        @Size(max = 2000)
        @Column(length = 2000)
        private String conditionDescription;

        @PositiveOrZero
        private Integer horsepower;

        @PositiveOrZero
        private Integer kilowatts;

        @PositiveOrZero
        private Integer torqueNm;

        @PositiveOrZero
        private Integer topSpeed;

        @PositiveOrZero
        @Column(precision = 4, scale = 1)
        private BigDecimal acceleration;

        @PositiveOrZero
        private Integer tankCapacity;

        private String engineCode;

        @PositiveOrZero
        @Column(precision = 5, scale = 2)
        private BigDecimal wltpFuelConsumption;

        @PositiveOrZero
        private Integer electricRange;

        @PositiveOrZero
        @Column(precision = 6, scale = 2)
        private BigDecimal batteryCapacityKwh;

        @PositiveOrZero
        @Column(precision = 5, scale = 2)
        private BigDecimal chargingTimeHours;

        @PositiveOrZero
        private Integer fastChargingPowerKw;

        @Positive
        private Integer numberOfSeats;

        @PositiveOrZero
        private Integer lengthMm;

        @PositiveOrZero
        private Integer widthMm;

        @PositiveOrZero
        private Integer heightMm;

        @PositiveOrZero
        private Integer grossVehicleWeight;

        @PositiveOrZero
        private Integer maxPayload;

        @PositiveOrZero
        private Integer trunkCapacityLitres;

        @PositiveOrZero
        private Integer numberOfGears;

        @Enumerated(EnumType.STRING)
        @Column(length = 32)
        private DriveType driveType;

        private String manufacturerColour;

        private String wheelSize;

        private String tyreSize;

        private String upholsteryColour;

        private String interiorColour;

        @Builder.Default
        @Column(nullable = false)
        private Boolean featured = false;

        @Builder.Default
        @Column(nullable = false)
        private Boolean reserved = false;

        @Builder.Default
        @Column(nullable = false)
        private Boolean sold = false;

        @ElementCollection
        @CollectionTable(name = "car_features", joinColumns = @JoinColumn(name = "car_id"))
        @OrderColumn(name = "feature_order")
        @Column(name = "feature", nullable = false, length = 255)
        @Builder.Default
        private List<@NotBlank @Size(max = 255) String> features = new ArrayList<>();

        @ManyToOne(fetch = FetchType.LAZY, optional = false)
        @JoinColumn(name = "user_id", nullable = false)
        @JsonIgnore
        private User user;

        @OneToMany(mappedBy = "car", cascade = CascadeType.ALL, orphanRemoval = true)
        @Builder.Default
        private List<CarPicture> pictures = new ArrayList<>();



        public void addFeature(String feature) {
                if (feature != null && !feature.isBlank()) {
                        String normalized = feature.trim();
                        if (!features.contains(normalized)) {
                                features.add(normalized);
                        }
                }
        }

        @Override
        public boolean equals(Object other) {
                if (this == other) return true;
                if (!(other instanceof Car car)) return false;
                return getId() != null && getId().equals(car.getId());
        }

        @Override
        public int hashCode() {
                return Car.class.hashCode();
        }

}
