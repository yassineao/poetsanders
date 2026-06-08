DELETE FROM cars;

ALTER TABLE cars
ADD COLUMN user_id uuid NOT NULL;

ALTER TABLE cars
ADD CONSTRAINT fk_cars_user
FOREIGN KEY (user_id)
REFERENCES users(id);