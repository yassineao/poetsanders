CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE car_pictures (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    storage_path VARCHAR(255) NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    description VARCHAR(255) NOT NULL,
    width INTEGER NOT NULL,
    height INTEGER NOT NULL,
    car_id UUID NOT NULL,

        CONSTRAINT fk_car_pictures_car
            FOREIGN KEY (car_id)
            REFERENCES cars(id)
            ON DELETE CASCADE
);

