-- V12 was applied to production before the reply fields were added to its
-- checked-in definition. Keep V12 immutable and bring older databases forward.
ALTER TABLE contact_messages
    ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    ADD COLUMN IF NOT EXISTS admin_reply VARCHAR(5000),
    ADD COLUMN IF NOT EXISTS replied_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_contact_messages_user_id
    ON contact_messages (user_id);

CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at
    ON contact_messages (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_contact_messages_status
    ON contact_messages (status);
