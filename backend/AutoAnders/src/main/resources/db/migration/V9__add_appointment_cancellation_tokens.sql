CREATE EXTENSION IF NOT EXISTS pgcrypto;

ALTER TABLE wash_calendar
    ADD COLUMN IF NOT EXISTS cancellation_token_hash VARCHAR(64);

UPDATE wash_calendar
SET cancellation_token_hash = encode(digest(id::text, 'sha256'), 'hex')
WHERE cancellation_token_hash IS NULL;

ALTER TABLE wash_calendar
    ALTER COLUMN cancellation_token_hash SET NOT NULL;

CREATE INDEX IF NOT EXISTS idx_wash_calendar_cancellation_token_hash
    ON wash_calendar(cancellation_token_hash);
