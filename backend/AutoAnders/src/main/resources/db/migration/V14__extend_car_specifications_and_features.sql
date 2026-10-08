-- Existing rows retain their data; new specifications are optional.
ALTER TABLE cars
    ADD COLUMN version BIGINT NOT NULL DEFAULT 0,
    ADD COLUMN variant VARCHAR(255),
    ADD COLUMN trim_level VARCHAR(255),
    ADD COLUMN vin VARCHAR(17),
    ADD COLUMN original_price NUMERIC(12, 2),
    ADD COLUMN discount_amount NUMERIC(12, 2),
    ADD COLUMN tax_scheme VARCHAR(255),
    ADD COLUMN last_service_date DATE,
    ADD COLUMN warranty_until DATE,
    ADD COLUMN accident_free BOOLEAN,
    ADD COLUMN imported BOOLEAN,
    ADD COLUMN number_of_previous_owners INTEGER,
    ADD COLUMN condition_description VARCHAR(2000),
    ADD COLUMN horsepower INTEGER,
    ADD COLUMN kilowatts INTEGER,
    ADD COLUMN torque_nm INTEGER,
    ADD COLUMN top_speed INTEGER,
    ADD COLUMN acceleration NUMERIC(4, 1),
    ADD COLUMN tank_capacity INTEGER,
    ADD COLUMN engine_code VARCHAR(255),
    ADD COLUMN wltp_fuel_consumption NUMERIC(5, 2),
    ADD COLUMN electric_range INTEGER,
    ADD COLUMN battery_capacity_kwh NUMERIC(6, 2),
    ADD COLUMN charging_time_hours NUMERIC(5, 2),
    ADD COLUMN fast_charging_power_kw INTEGER,
    ADD COLUMN number_of_seats INTEGER,
    ADD COLUMN length_mm INTEGER,
    ADD COLUMN width_mm INTEGER,
    ADD COLUMN height_mm INTEGER,
    ADD COLUMN gross_vehicle_weight INTEGER,
    ADD COLUMN max_payload INTEGER,
    ADD COLUMN trunk_capacity_litres INTEGER,
    ADD COLUMN number_of_gears INTEGER,
    ADD COLUMN drive_type VARCHAR(32),
    ADD COLUMN manufacturer_colour VARCHAR(255),
    ADD COLUMN wheel_size VARCHAR(255),
    ADD COLUMN tyre_size VARCHAR(255),
    ADD COLUMN upholstery_colour VARCHAR(255),
    ADD COLUMN interior_colour VARCHAR(255),
    ADD COLUMN featured BOOLEAN NOT NULL DEFAULT FALSE,
    ADD COLUMN reserved BOOLEAN NOT NULL DEFAULT FALSE,
    ADD COLUMN sold BOOLEAN NOT NULL DEFAULT FALSE;

CREATE TABLE car_features (
    car_id UUID NOT NULL REFERENCES cars(id) ON DELETE CASCADE,
    feature_order INTEGER NOT NULL,
    feature VARCHAR(255) NOT NULL,
    PRIMARY KEY (car_id, feature_order)
);

CREATE INDEX IF NOT EXISTS idx_cars_brand_model ON cars(brand, model);
CREATE INDEX IF NOT EXISTS idx_cars_status ON cars(status);
CREATE INDEX IF NOT EXISTS idx_cars_price ON cars(price);
CREATE INDEX IF NOT EXISTS idx_cars_user_id ON cars(user_id);
CREATE INDEX IF NOT EXISTS idx_cars_vin ON cars(vin);
