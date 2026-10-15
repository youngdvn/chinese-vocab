DROP INDEX IF EXISTS idx_vocabularies_user_created;
DROP INDEX IF EXISTS idx_vocabularies_user_status;

ALTER TABLE vocabularies
DROP COLUMN IF EXISTS status;

ALTER TABLE users
DROP COLUMN IF EXISTS daily_goal;
