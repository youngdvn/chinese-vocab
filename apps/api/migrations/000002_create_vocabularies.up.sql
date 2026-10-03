CREATE TABLE vocabularies (
    id BIGSERIAL PRIMARY KEY,

    user_id BIGINT NOT NULL,

    hanzi VARCHAR(100) NOT NULL,
    pinyin VARCHAR(255),
    meaning TEXT NOT NULL,
    example TEXT,
    note TEXT,
    hsk_level SMALLINT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_vocabularies_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);