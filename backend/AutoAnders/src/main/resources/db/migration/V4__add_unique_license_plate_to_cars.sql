ALTER TABLE cars
ADD CONSTRAINT uk_cars_license_plate UNIQUE (license_plate);