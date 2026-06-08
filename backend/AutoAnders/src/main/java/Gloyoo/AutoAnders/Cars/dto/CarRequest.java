package Gloyoo.AutoAnders.Cars.dto;


import Gloyoo.AutoAnders.Cars.entity.*;

import java.math.BigDecimal;
import java.time.LocalDate;

public record CarRequest(
        String title,
        String subtitle,

        Integer yearOfManufacture,
        Integer mileage,
        String power,
        String referenceNumber,
        BigDecimal price,

        LocalDate firstRegistrationDate,
        Integer numberOfDoors,
        Integer wheelbase,
        Integer numberOfCylinders,
        String motorVehicleTax,
        LocalDate modelDateFrom,
        LocalDate modelDateTo,
        Integer maxTowingWeight,
        Integer maxTowingWeightUnbraked,
        BigDecimal urbanFuelConsumption,
        BigDecimal combinedFuelConsumption,
        BigDecimal motorwayFuelConsumption,
        Integer co2Emissions,
        Boolean taxDeductible,
        String chassisNumber,
        Integer numberOfKeys,

        String licensePlate,
        Integer engineDisplacement,
        String colour,
        Integer emptyWeight,
        Integer taxAdditionPercentage,
        String apkMotDate,
        Boolean serviceDocumentation,
        String location,

        BigDecimal financialLeasePricePerMonth,
        BigDecimal leasePrice60Months,
        BigDecimal leasePrice48Months,
        BigDecimal leasePrice36Months,

        BodyType bodyType,
        Gearbox gearbox,
        Fuel fuel,
        EmissionClass emissionClass,
        EnergyLabel energyLabel,
        PaintType paintType,
        Upholstery upholstery,
        Status status
) {}