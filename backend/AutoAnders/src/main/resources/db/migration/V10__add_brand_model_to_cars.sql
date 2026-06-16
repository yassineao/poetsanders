ALTER TABLE cars
    ADD COLUMN IF NOT EXISTS brand VARCHAR(255),
    ADD COLUMN IF NOT EXISTS model VARCHAR(255);

UPDATE cars
SET
    brand = COALESCE(NULLIF(TRIM(brand), ''), 'Unknown'),
    model = COALESCE(NULLIF(TRIM(model), ''), 'Unknown');

ALTER TABLE cars
    ALTER COLUMN brand SET NOT NULL,
    ALTER COLUMN model SET NOT NULL;
