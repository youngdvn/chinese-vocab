ALTER TABLE vocabularies
ADD COLUMN status VARCHAR(20) NOT NULL DEFAULT 'new';

CREATE INDEX IF NOT EXISTS idx_vocabularies_user_status ON vocabularies(user_id, status);
CREATE INDEX IF NOT EXISTS idx_vocabularies_user_created ON vocabularies(user_id, created_at DESC);

ALTER TABLE users
ADD COLUMN daily_goal INT NOT NULL DEFAULT 20;
