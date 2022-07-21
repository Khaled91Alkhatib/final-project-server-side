-- Drop and recreate sizes table

DROP TABLE IF EXISTS sizes CASCADE;

CREATE TABLE sizes (
  id SERIAL PRIMARY KEY NOT NULL,
  size SMALLINT NOT NULL
);
