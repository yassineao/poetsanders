CREATE TABLE IF NOT EXISTS profile_access_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(64) NOT NULL UNIQUE,
    expires_at TIMESTAMP NOT NULL,
    used_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_profile_access_tokens_token_hash
    ON profile_access_tokens(token_hash);

CREATE INDEX IF NOT EXISTS idx_profile_access_tokens_user_id
    ON profile_access_tokens(user_id);
