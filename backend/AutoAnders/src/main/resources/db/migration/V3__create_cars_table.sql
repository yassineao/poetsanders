CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE cars (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    title VARCHAR(255),
    subtitle VARCHAR(255),

    year_of_manufacture INTEGER,
    mileage INTEGER,
    power VARCHAR(100),
    reference_number VARCHAR(255),
    price NUMERIC(12, 2),

    first_registration_date DATE,
    number_of_doors INTEGER,
    wheelbase INTEGER,
    number_of_cylinders INTEGER,
    motor_vehicle_tax VARCHAR(100),
    model_date_from DATE,
    model_date_to DATE,

    max_towing_weight INTEGER,
    max_towing_weight_unbraked INTEGER,

    urban_fuel_consumption NUMERIC(6, 2),
    combined_fuel_consumption NUMERIC(6, 2),
    motorway_fuel_consumption NUMERIC(6, 2),

    co2_emissions INTEGER,
    tax_deductible BOOLEAN,
    chassis_number VARCHAR(255),
    number_of_keys INTEGER,

    license_plate VARCHAR(100),
    engine_displacement INTEGER,
    colour VARCHAR(100),
    empty_weight INTEGER,
    tax_addition_percentage INTEGER,
    apk_mot_date VARCHAR(100),
    service_documentation BOOLEAN,
    location VARCHAR(255),

    financial_lease_price_per_month NUMERIC(12, 2),
    lease_price_60_months NUMERIC(12, 2),
    lease_price_48_months NUMERIC(12, 2),
    lease_price_36_months NUMERIC(12, 2),

    body_type VARCHAR(100),
    gearbox VARCHAR(100),
    fuel VARCHAR(100),
    emission_class VARCHAR(100),
    energy_label VARCHAR(100),
    paint_type VARCHAR(100),
    upholstery VARCHAR(100),

    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_cars_reference_number ON cars(reference_number);
CREATE INDEX idx_cars_title ON cars(title);
CREATE INDEX idx_cars_fuel ON cars(fuel);
CREATE INDEX idx_cars_body_type ON cars(body_type);