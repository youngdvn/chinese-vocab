DROP INDEX IF EXISTS idx_vocabularies_user_next_review;

ALTER TABLE vocabularies
DROP COLUMN IF EXISTS next_review_at;
