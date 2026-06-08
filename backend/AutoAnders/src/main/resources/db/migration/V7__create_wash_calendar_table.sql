CREATE EXTENSION IF NOT EXISTS "uuid-ossp";


CREATE TABLE wash_calendar (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    wash_type VARCHAR(50) NOT NULL,
    user_id UUID NOT NULL,
    local_date_time TIMESTAMP NOT NULL,

    CONSTRAINT fk_wash_calendar_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
);
