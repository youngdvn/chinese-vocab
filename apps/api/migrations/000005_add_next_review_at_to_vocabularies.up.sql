ALTER TABLE vocabularies
ADD COLUMN IF NOT EXISTS next_review_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_vocabularies_user_next_review ON vocabularies(user_id, next_review_at);
