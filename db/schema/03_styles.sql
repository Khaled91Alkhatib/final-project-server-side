-- Drop and recreate styles table

DROP TABLE IF EXISTS styles CASCADE;

CREATE TABLE styles (
  id SERIAL PRIMARY KEY NOT NULL,
  style VARCHAR(255) NOT NULL
);
