CREATE TABLE reviews (
    id BIGSERIAL PRIMARY KEY,

    user_id BIGINT NOT NULL,
    vocabulary_id BIGINT NOT NULL,

    rating SMALLINT NOT NULL,

    reviewed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    next_review_at TIMESTAMPTZ,

    CONSTRAINT fk_reviews_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_reviews_vocabulary
        FOREIGN KEY (vocabulary_id)
        REFERENCES vocabularies(id)
        ON DELETE CASCADE,

    CONSTRAINT reviews_rating_check
        CHECK (rating BETWEEN 1 AND 4)
);