CREATE TABLE IF NOT EXISTS contact_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    company_name VARCHAR(120) NOT NULL,
    phone_number VARCHAR(80),
    message VARCHAR(5000) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'NEW',
    email_delivered BOOLEAN NOT NULL DEFAULT FALSE,
    email_error VARCHAR(500),
    admin_reply VARCHAR(5000),
    replied_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_contact_messages_user_id
    ON contact_messages (user_id);

CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at
    ON contact_messages (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_contact_messages_status
    ON contact_messages (status);
